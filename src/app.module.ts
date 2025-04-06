import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { MemberModule } from "./member/member.module";
import { CouponModule } from "./coupon/coupon.module";
import { ProductModule } from "./product/product.module";
import { OrderModule } from "./order/order.module";

@Module({
  imports: [MemberModule, CouponModule, ProductModule, OrderModule],
})
export class AppModule {}
