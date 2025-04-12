import { PrismaService } from "@app/database/prisma/prisma.service";
import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Injectable } from "@nestjs/common";
import { Order } from "@prisma/client";
import { OrderStatus } from "../domain/dto/order-status.enum";
import { IOrderRepository } from "../repository/order.repository.interface";

@Injectable()
export class OrderRepository extends PrismaRepository<Order> implements IOrderRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.order);
  }

  async createOrder(memberId: number, totalSales: number, status: OrderStatus): Promise<Order> {
    return await this.prisma.order.create({
      data: {
        memberId,
        totalSales,
        status,
      },
    });
  }

  async cancelOrder(orderId: number): Promise<Order> {
    return await this.updateById(orderId, { status: OrderStatus.ORDER_CANCEL });
  }

  async getOrder(orderId: number) {
    return await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
