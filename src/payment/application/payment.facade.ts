import { HttpException, Injectable } from "@nestjs/common";
import { ProcessPaymentFacadeReqDto } from "./dto/process-payment.facade.req.dto";
import { MemberService } from "@app/member/domain/service/member.service";
import { OrderService } from "@app/order/domain/service/order.service";
import { ProductService } from "@app/product/domain/service/product.service";
import { ProductSalesStatService } from "@app/productSalesStat/domain/service/productSalesStat.service";
import { PaymentService } from "../domain/service/payment.service";
import { ProcessPaymentCommand } from "../domain/dto/process-payment.command.dto";
import { Payment, Prisma } from "@prisma/client";
import { GetOrderCommand } from "@app/order/domain/dto/get-order.command.dto";
import { DeductStockCommand } from "@app/product/domain/dto/deduct-stock.command.dto";
import { UseBalanceCommand } from "@app/member/domain/dto/use-balance.command.dto";
import { PaymentResult } from "../domain/dto/payment.result.dto";
import {
  AddProductSalesStatCommand,
  PaidProduct,
} from "@app/productSalesStat/domain/dto/add-product-sales-stat.command.dto";
import { TransactionService } from "@app/database/prisma/transaction.service";
import { CouponService } from "@app/coupon/domain/service/coupon.service";
import { UseCouponCommand } from "@app/coupon/domain/dto/use-coupon.command.dto";
import { PayOrderCommand } from "@app/order/domain/dto/pay-order.command.dto";
import { DistributedLock, DistributedMultiLock } from "@app/redis/redisDistributedLock.decorator";
import { DistributedLockService } from "@app/redis/redisDistributedLock.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { PayCompletedEvent } from "@app/common/events/pay-completed.event";

@Injectable()
export class PaymentFacade {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly paymentService: PaymentService,
    private readonly memberService: MemberService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly couponService: CouponService,
    private readonly productSalesStatService: ProductSalesStatService,
    private readonly lockService: DistributedLockService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  @DistributedMultiLock([
    (reqDto: ProcessPaymentFacadeReqDto) => `lock:member:${reqDto.memberId}`,
    (reqDto: ProcessPaymentFacadeReqDto) => `lock:order:${reqDto.orderId}`
  ])
  async processPayment(processPaymentReqDto: ProcessPaymentFacadeReqDto, txc?: Prisma.TransactionClient): Promise<PaymentResult> {
    const orderId = processPaymentReqDto.orderId;
    const memberId = processPaymentReqDto.memberId;
    const couponId = processPaymentReqDto.couponId;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;
      let deductStockCommands: DeductStockCommand[];
      let productResult = undefined;

      try {
        // 주문 상태 변경
        const payOrderCommand: PayOrderCommand = { orderId };
        await this.orderService.payOrder(payOrderCommand, client);

        // 주문 정보 조회
        const getOrderCommand: GetOrderCommand = { orderId };
        const order = await this.orderService.getOrder(getOrderCommand, client);

        // 상품 재고 차감
        // 트랜잭션 전파 하지말고, 상품 재고 차감에 대한 분산 락은 재고 차감 시 마다 획득한다.
        // 만약 재고 차감 중에 실패할 경우 재고에 대한 롤백 처리는 자체적으로 진행하고 실패에 대한 응답을 facade 로 주면 현재 트랜잭션이 롤백 됨.
        // 재고 차감 트랜잭션 수행 후 생긴 에러에 대해서는 보상 트랜잭션을 실행하여야 함.
        deductStockCommands = order.orderProducts.map(({ productId, amount }) => ({ productId, amount }));
        productResult = await this.productService.deductProductStockBulk(deductStockCommands);

        // 잔액 차감
        const amount = this.calculateTotalAmount(order.orderProducts);
        const useCouponCommand: UseCouponCommand = { memberId, couponId, amount };
        const {coupon, discountedAmount} = await this.couponService.useCoupon(useCouponCommand, client);

        const useBalanceCommand: UseBalanceCommand = {
          memberId,
          amount: discountedAmount,
        };
        await this.memberService.useBalance(useBalanceCommand, client);

        // 결제 정보 저장
        const today = new Date();
        const processPaymentCommand: ProcessPaymentCommand = { orderId, memberId, couponId, approved_at: today, amount: discountedAmount };
        const payment: Payment = await this.paymentService.processPayment(processPaymentCommand, client);

        // 판매 이력 저장
        let salesDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        salesDate = new Date(salesDate.getTime() + 9 * 60 * 60 * 1000);
        const paidProducts: PaidProduct[] = order.orderProducts.map((orderProduct) => ({
          productId: orderProduct.productId,
          productName: orderProduct.product.name,
          total_amount: orderProduct.amount,
          total_sales: orderProduct.amount * orderProduct.product.price,
        }));
        const addProductSalesStatCommand: AddProductSalesStatCommand = {
          salesDate,
          paidProducts,
        };
        await this.productSalesStatService.addProductSalesStat(addProductSalesStatCommand, client);

        const event: PayCompletedEvent = { order };
        this.eventEmitter.emit('pay.completed', event);

        return payment;
      } catch(error) {
        // TODO - Kafka 도입 시 보상 트랜잭션 처리 관련 개선 필요
        // 결제 로직 진행 중 장애 발생 시 상품 재고 차감에 대한 롤백을 진행해 줄 수 있지만 완벽한 해결책은 될 수 없음.
        // Kafka 와 같은 MQ 솔루션을 이용해 보상 트랜잭션 발행 방식으로 변경할 필요 있음.
        if(productResult != undefined) {
          await this.productService.deductProductStockBulk_rollback(deductStockCommands);
          console.log(1)
        }

        if(error instanceof HttpException || error instanceof PrismaClientKnownRequestError) {
          throw error;
        } else {
          throw new Error("주문 결제 중 예기치 못한 문제가 발생하였습니다. 관리자에게 문의해주세요.")
        }
      }
    });
  }

  private calculateTotalAmount(orderProducts): number {
    let totalAmount = 0;
    for(const product of orderProducts) {
      totalAmount += product.amount * product.product.price;
    }

    return totalAmount;
  }
}