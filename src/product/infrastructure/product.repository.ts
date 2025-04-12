import { PrismaService } from "@app/database/prisma/prisma.service";
import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Injectable } from "@nestjs/common";
import { IProductRepository } from "../domain/repository/product.repository.interface";
import { Product } from "@prisma/client";

@Injectable()
export class ProductRepository extends PrismaRepository<Product> implements IProductRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.product);
  }

  async updateStock(id: number, stock: number): Promise<Product> {
    return await this.updateById(id, { stock });
  }
}
