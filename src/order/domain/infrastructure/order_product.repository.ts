import { PrismaService } from "@app/database/prisma/prisma.service";
import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { IRepository } from "@app/database/repository.interface";
import { Injectable } from "@nestjs/common";
import { Order_Product } from "@prisma/client";
import { IOrderProductRepository } from "../order_product.repository.interface";

@Injectable()
export class OrderProductRepository extends PrismaRepository<Order_Product> implements IOrderProductRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.order_Product);
  }

  async createOrderProduct(orderId: number, productId: number, amount: number): Promise<Order_Product> {
    return await this.prisma.order_Product.create({
      data: {
        order: { connect: { id: orderId } },
        product: { connect: { id: productId } },
        amount,
      },
    });
  }
}
