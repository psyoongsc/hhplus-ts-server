import { IRepository } from "@app/database/repository.interface";
import { Order } from "@prisma/client";
import { OrderStatus } from "./dto/order-status.enum";

export interface IOrderRepository extends IRepository<Order> {
  createOrder(memberId: number, totalSales: number, status: OrderStatus): Promise<Order>;
  cancelOrder(orderId: number): Promise<Order>;
  getOrder(orderId: number);
}

export const IORDER_REPOSITORY = Symbol("IORDER_REPOSITORY");
