import { Inject, Injectable } from "@nestjs/common";
import { OrderProductCommand, Product } from "../dto/order-product.command";
import { OrderResult } from "../dto/order.result";
import { OrderStatus } from "../dto/order-status.enum";
import { CancelOrderCommand } from "../dto/cancel-order.command";
import { OrderRepository } from "../../infrastructure/order.repository";
import { OrderProductRepository } from "../../infrastructure/order_product.repository";
import { getEnumFromValue } from "@app/common/enum.common";
import { GetOrderCommand } from "../dto/get-order.command";
import { IORDER_REPOSITORY } from "../../repository/order.repository.interface";
import { IORDER_PRODUCT_REPOSITORY } from "../../repository/order_product.repository.interface";

// TODO - 단위 테스트 작성 해야함
@Injectable()
export class OrderService {
  constructor(
    @Inject(IORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(IORDER_PRODUCT_REPOSITORY)
    private readonly orderProductRepository: OrderProductRepository,
  ) {}

  async orderProduct(command: OrderProductCommand): Promise<OrderResult> {
    const memberId = command.memberId;
    const products: Product[] = command.products;

    let totalSales = 0;
    for (const product of products) {
      totalSales += product.price;
    }

    const order = await this.orderRepository.createOrder(memberId, totalSales, OrderStatus.PAYMENT_PREPARING);

    for (const product of products) {
      await this.orderProductRepository.createOrderProduct(order.id, product.id, product.amount);
    }

    const result: OrderResult = {
      id: order.id,
      memberId: order.memberId,
      totalSales: order.totalSales,
      status: getEnumFromValue(OrderStatus, order.status),
    };
    return result;
  }

  async cancelOrder(command: CancelOrderCommand): Promise<OrderResult> {
    const orderId = command.orderId;

    const order = await this.orderRepository.findById(orderId);
    if (order === null) {
      throw new Error("ORDER_NOT_FOUND");
    }

    const canceledOrder = await this.orderRepository.cancelOrder(orderId);

    const result: OrderResult = {
      id: canceledOrder.id,
      memberId: canceledOrder.memberId,
      totalSales: canceledOrder.totalSales,
      status: getEnumFromValue(OrderStatus, canceledOrder.status),
    };

    return result;
  }

  async getOrder(command: GetOrderCommand) {
    const orderId = command.orderId;

    return await this.orderRepository.getOrder(orderId);
  }
}
