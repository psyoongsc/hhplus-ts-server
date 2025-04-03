import { Module } from "@nestjs/common";
import { OrderService } from "./domain/service/order.service";
import { OrderController } from "./presentation/order.controller";

@Module({
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
