import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Product_Sales_Stat } from "./entity/product_sales_stat.entity";
import { PrismaService } from "@app/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductSalesStatRepository extends PrismaRepository<Product_Sales_Stat> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.product_Sales_Stat);
  }
}
