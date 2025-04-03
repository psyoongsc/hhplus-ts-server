import { Module } from "@nestjs/common";
import { CouponController } from "./presentation/coupon.controller";
import { CouponService } from "./domain/service/coupon.service";

@Module({
  controllers: [CouponController],
  providers: [CouponService],
})
export class CouponModule {}
