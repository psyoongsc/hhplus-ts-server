import { PrismaModule } from "@app/database/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { ProductSalesStatController } from "./presentation/productSalesStat.controller";
import { ProductSalesStatService } from "./domain/service/productSalesStat.service";
import { ProductSalesStatRepository } from "./infrastructure/product_sales_stat.repository";
import { IPRODUCT_SALES_STAT_REPOSITORY } from "./domain/repository/product_sales_stat.interface.repository";
import { IPRODUCT_SALES_STAT_VIEW_REPOSITORY } from "./domain/repository/product_sales_stat_view.interface.repository";
import { ProductSalesStatViewRepository } from "./infrastructure/product_sales_stat_view.repository";

@Module({
  imports: [PrismaModule],
  controllers: [ProductSalesStatController],
  providers: [
    ProductSalesStatService,
    {
      provide: IPRODUCT_SALES_STAT_REPOSITORY,
      useClass: ProductSalesStatRepository,
    },
    // {
    //   provide: IPRODUCT_SALES_STAT_VIEW_REPOSITORY,
    //   useClass: ProductSalesStatViewRepository,
    // },
  ],
  exports: [ProductSalesStatService],
})
export class ProductSalesStatModule {}
