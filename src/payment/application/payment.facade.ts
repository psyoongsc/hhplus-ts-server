import { Injectable } from "@nestjs/common";
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
  ) {}

  async processPayment(processPaymentReqDto: ProcessPaymentFacadeReqDto, txc?: Prisma.TransactionClient): Promise<PaymentResult> {
    const orderId = processPaymentReqDto.orderId;
    const memberId = processPaymentReqDto.memberId;
    const couponId = processPaymentReqDto.couponId;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      const payOrderCommand: PayOrderCommand = { orderId };
      await this.orderService.payOrder(payOrderCommand, client);

      const getOrderCommand: GetOrderCommand = { orderId };
      const order = await this.orderService.getOrder(getOrderCommand, client);

      const deductStockCommands: DeductStockCommand[] = order.orderProducts.map(({ productId, amount }) => ({ productId, amount }));

      const amount = await this.productService.deductProductStockBulk(deductStockCommands, client);

      const useCouponCommand: UseCouponCommand = { memberId, couponId, amount };
      const {coupon, discountedAmount} = await this.couponService.useCoupon(useCouponCommand, client);

      const useBalanceCommand: UseBalanceCommand = {
        memberId,
        amount: discountedAmount,
      };
      await this.memberService.useBalance(useBalanceCommand, client);

      const today = new Date();
      const processPaymentCommand: ProcessPaymentCommand = { orderId, memberId, couponId, approved_at: today, amount: discountedAmount };
      const payment: Payment = await this.paymentService.processPayment(processPaymentCommand, client);

      const salesDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
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

      return payment;
    });
  }
}
