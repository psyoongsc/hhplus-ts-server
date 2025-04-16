import { Inject, Injectable } from "@nestjs/common";
import { OrderProductCommand, Product } from "../dto/order-product.command.dto";
import { OrderResult } from "../dto/order.result.dto";
import { OrderStatus } from "../dto/order-status.enum";
import { CancelOrderCommand } from "../dto/cancel-order.command.dto";
import { OrderRepository } from "../../infrastructure/order.repository";
import { OrderProductRepository } from "../../infrastructure/order_product.repository";
import { getEnumFromValue } from "@app/common/enum.common";
import { IORDER_REPOSITORY } from "../repository/order.repository.interface";
import { IORDER_PRODUCT_REPOSITORY } from "../repository/order_product.repository.interface";
import { GetOrderCommand } from "../dto/get-order.command.dto";
import { TransactionService } from "@app/database/prisma/transaction.service";
import { Prisma } from "@prisma/client";
import { PayOrderCommand } from "../dto/pay-order.command.dto";

// TODO - 단위 테스트 작성 해야함
@Injectable()
export class OrderService {
  constructor(
    @Inject(IORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(IORDER_PRODUCT_REPOSITORY)
    private readonly orderProductRepository: OrderProductRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async orderProduct(command: OrderProductCommand, txc?: Prisma.TransactionClient): Promise<OrderResult> {
    const memberId = command.memberId;
    const products: Product[] = command.products;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      let totalSales = 0;
      for (const product of products) {
        totalSales += product.price * product.amount;
      }
  
      const order = await this.orderRepository.createOrder(memberId, totalSales, OrderStatus.PAYMENT_PREPARING, client);
  
      for (const product of products) {
        await this.orderProductRepository.createOrderProduct(order.id, product.id, product.amount, client);
      }
  
      const result: OrderResult = {
        id: order.id,
        memberId: order.memberId,
        totalSales: order.totalSales,
        status: getEnumFromValue(OrderStatus, order.status),
      };
      return result;
    });
  }

  async payOrder(command: PayOrderCommand, txc?: Prisma.TransactionClient): Promise<OrderResult> {
    const orderId = command.orderId;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      const order = await this.orderRepository.findById(orderId, client);
      if (order === null) {
        throw new Error("ORDER_NOT_FOUND");
      }
      if (order.status != "결제준비") {
        throw new Error("CANT_PAY_ORDER");
      }
  
      const paidOrder = await this.orderRepository.paymentCompleteOrder(orderId, client);
  
      const result: OrderResult = {
        id: paidOrder.id,
        memberId: paidOrder.memberId,
        totalSales: paidOrder.totalSales,
        status: getEnumFromValue(OrderStatus, paidOrder.status),
      };
  
      return result;
    })
  }

  async cancelOrder(command: CancelOrderCommand, txc?: Prisma.TransactionClient): Promise<OrderResult> {
    const orderId = command.orderId;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      const order = await this.orderRepository.findById(orderId, client);
      if (order === null) {
        throw new Error("ORDER_NOT_FOUND");
      }
      if (order.status == "주문취소") {
        throw new Error("ALREADY_CANCELED_ORDER");
      }
  
      const canceledOrder = await this.orderRepository.cancelOrder(orderId, client);
  
      const result: OrderResult = {
        id: canceledOrder.id,
        memberId: canceledOrder.memberId,
        totalSales: canceledOrder.totalSales,
        status: getEnumFromValue(OrderStatus, canceledOrder.status),
      };
  
      return result;
    });
  }

  async getOrder(command: GetOrderCommand, txc?: Prisma.TransactionClient) {
    const orderId = command.orderId;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      const order = await this.orderRepository.findById(orderId, client);
      if (order === null) {
        throw new Error("ORDER_NOT_FOUND");
      }

      return await this.orderRepository.getOrder(orderId, client);
    });
  }
}
