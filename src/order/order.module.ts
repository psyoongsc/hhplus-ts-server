import { Module } from "@nestjs/common";
import { OrderService } from "./domain/service/order.service";
import { OrderController } from "./presentation/order.controller";
import { PrismaModule } from "@app/database/prisma/prisma.module";
import { OrderRepository } from "./domain/infrastructure/order.repository";
import { OrderProductRepository } from "./domain/infrastructure/order_product.repository";
import { IORDER_REPOSITORY } from "./domain/order.repository.interface";
import { IORDER_PRODUCT_REPOSITORY } from "./domain/order_product.repository.interface";

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: IORDER_REPOSITORY,
      useClass: OrderRepository,
    },
    {
      provide: IORDER_PRODUCT_REPOSITORY,
      useClass: OrderProductRepository,
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
