import { Module } from "@nestjs/common";
import { ProductService } from "./domain/service/product.service";
import { ProductController } from "./presentation/product.controller";
import { PrismaModule } from "@app/database/prisma/prisma.module";
import { ProductRepository } from "./domain/product.repository";
import { ProductSalesStatRepository } from "./domain/product_sales_stat.repository";

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductSalesStatRepository],
})
export class ProductModule {}
