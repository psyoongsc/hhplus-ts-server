import { PrismaService } from "@app/database/prisma/prisma.service";
import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Product } from "./entity/product.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductRepository extends PrismaRepository<Product> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.product);
  }

  async updateStock(id: number, stock: number) {
    return await this.updateById(id, { stock });
  }
}
