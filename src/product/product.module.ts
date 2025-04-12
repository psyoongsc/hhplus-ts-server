import { Module } from "@nestjs/common";
import { ProductService } from "./domain/service/product.service";
import { ProductController } from "./presentation/product.controller";
import { PrismaModule } from "@app/database/prisma/prisma.module";
import { ProductRepository } from "./domain/infrastructure/product.repository";
import { IPRODUCT_REPOSITORY } from "./domain/product.repository.interface";

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: IPRODUCT_REPOSITORY,
      useClass: ProductRepository,
    },
  ],
  exports: [ProductService],
})
export class ProductModule {}
