import { Injectable } from "@nestjs/common";
import { ProcessPaymentFacadeReqDto } from "./dto/process-payment.facade.req.dto";
import { MemberService } from "@app/member/domain/service/member.service";
import { OrderService } from "@app/order/domain/service/order.service";
import { ProductService } from "@app/product/domain/service/product.service";
import { ProductSalesStatService } from "@app/productSalesStat/domain/service/productSalesStat.service";
import { PaymentService } from "../service/payment.service";
import { ProcessPaymentCommand } from "../dto/process-payment.command";
import { Payment } from "@prisma/client";
import { GetOrderCommand } from "@app/order/domain/dto/get-order.command";
import { DeductStockCommand } from "@app/product/domain/dto/deduct-stock.command";
import { AddStockCommand } from "@app/product/domain/dto/add-stock.command";
import { UseBalanceCommand } from "@app/member/domain/dto/use-balance.command";
import { PaymentResult } from "../dto/payment.result";
import { ChargeBalanceCommand } from "@app/member/domain/dto/charge-balance.command";
import {
  AddProductSalesStatCommand,
  PaidProduct,
} from "@app/productSalesStat/domain/dto/add-product-sales-stat.command";

@Injectable()
export class PaymentFacade {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly memberService: MemberService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly productSalesStatService: ProductSalesStatService,
  ) {}

  async processPayment(processPaymentReqDto: ProcessPaymentFacadeReqDto): Promise<PaymentResult> {
    const orderId = processPaymentReqDto.orderId;
    const memberId = processPaymentReqDto.memberId;
    const couponId = processPaymentReqDto.couponId;

    const getOrderCommand: GetOrderCommand = { orderId };
    let order;

    order = await this.orderService.getOrder(getOrderCommand);
    if (order == null) {
      throw new Error("NOT_FOUND_ORDER");
    }

    const amount = order.totalSales;
    const orderProducts = order.orderProducts;

    let deductedOrderProducts = 0;
    for (const orderProduct of orderProducts) {
      try {
        const deductStockCommand: DeductStockCommand = {
          productId: orderProduct.productId,
          amount: orderProduct.amount,
        };
        await this.productService.deductStock(deductStockCommand);
        deductedOrderProducts++;
      } catch (error) {
        for (let i = 0; i < deductedOrderProducts; i++) {
          const addStockCommand: AddStockCommand = {
            productId: orderProducts[i].productId,
            amount: orderProducts[i].amount,
          };
          await this.productService.addStock(addStockCommand);
        }

        throw error;
      }
    }

    try {
      const useBalanceCommand: UseBalanceCommand = {
        memberId,
        amount,
      };
      await this.memberService.use(useBalanceCommand);
    } catch (error) {
      for (const orderProduct of orderProducts) {
        const addStockCommand: AddStockCommand = {
          productId: orderProduct.productId,
          amount: orderProduct.amount,
        };
        await this.productService.addStock(addStockCommand);
      }

      throw error;
    }

    try {
      const today = new Date();
      const processPaymentCommand: ProcessPaymentCommand = { orderId, memberId, couponId, approved_at: today, amount };
      const payment: Payment = await this.paymentService.processPayment(processPaymentCommand);

      const salesDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const paidProducts: PaidProduct[] = orderProducts.map((orderProduct) => ({
        productId: orderProduct.productId,
        productName: orderProduct.product.name,
        total_amount: orderProduct.amount,
        total_sales: orderProduct.amount * orderProduct.product.price,
      }));
      const addProductSalesStatCommand: AddProductSalesStatCommand = {
        salesDate,
        paidProducts,
      };
      await this.productSalesStatService.addProductSalesStat(addProductSalesStatCommand);

      return payment;
    } catch (error) {
      for (const orderProduct of orderProducts) {
        const addStockCommand: AddStockCommand = {
          productId: orderProduct.productId,
          amount: orderProduct.amount,
        };
        await this.productService.addStock(addStockCommand);
      }

      const chargeBalanceCommand: ChargeBalanceCommand = {
        memberId,
        amount,
      };
      await this.memberService.charge(chargeBalanceCommand);

      throw error;
    }
  }
}
