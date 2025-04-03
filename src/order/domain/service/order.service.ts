import { Injectable } from "@nestjs/common";
import { OrderProductCommand, Product } from "../dto/order-product.command";
import { OrderResult } from "../dto/order.result";
import { OrderStatus } from "../dto/order-status.enum";
import { CancelOrderCommand } from "../dto/cancel-order.command";
import { PayOrderCommand } from "../dto/pay-order.command";

@Injectable()
export class OrderService {
  async orderProduct(command: OrderProductCommand): Promise<OrderResult> {
    const memberId = command.memberId;
    const products: Product[] = command.products;

    return {
      id: 1,
      memberId: memberId,
      couponId: NaN,
      totalSales: 2424900,
      discountedSales: 2424900,
      status: OrderStatus.PAYMENT_PREPARING,
    };
  }

  async cancelOrder(command: CancelOrderCommand): Promise<OrderResult> {
    const orderId = command.orderId;

    return {
      id: 1,
      memberId: 1,
      couponId: NaN,
      totalSales: 2424900,
      discountedSales: 2424900,
      status: OrderStatus.ORDER_CANCEL,
    };
  }

  async payOrder(command: PayOrderCommand): Promise<OrderResult> {
    const orderId = command.orderId;
    const couponId = command.couponId;

    return {
      id: 1,
      memberId: 1,
      couponId: couponId,
      totalSales: 2424900,
      discountedSales: 1212450,
      status: OrderStatus.PAYMENT_COMPLETED,
    };
  }
}
