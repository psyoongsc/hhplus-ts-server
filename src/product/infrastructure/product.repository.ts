import { PrismaService } from "@app/database/prisma/prisma.service";
import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Injectable } from "@nestjs/common";
import { IProductRepository } from "../domain/repository/product.repository.interface";
import { Prisma, Product } from "@prisma/client";

@Injectable()
export class ProductRepository extends PrismaRepository<Product> implements IProductRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, (client) => client.product);
  }

  async updateStock(id: number, stock: number, tx?: Prisma.TransactionClient): Promise<Product> {
    const client = tx ?? this.prisma;
    
    return await this.updateById(id, { stock }, client);
  }
}
