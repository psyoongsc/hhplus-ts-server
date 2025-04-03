import { Module } from "@nestjs/common";
import { ProductService } from "./domain/service/product.service";
import { ProductController } from "./presentation/product.controller";

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
