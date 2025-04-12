import { Module } from "@nestjs/common";
import { CouponController } from "./presentation/coupon.controller";
import { CouponService } from "./domain/service/coupon.service";
import { ICOUPON_REPOSITORY } from "./domain/repository/coupon.repository.interface";
import { CouponRepository } from "./infrastructure/coupon.repository";
import { IMEMBER_COUPON_REPOSITORY } from "./domain/repository/member_coupon.repository.interface";
import { MemberCouponRepository } from "./infrastructure/member_coupon.repository";
import { PrismaModule } from "@app/database/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [CouponController],
  providers: [
    CouponService,
    {
      provide: ICOUPON_REPOSITORY,
      useClass: CouponRepository
    },
    {
      provide: IMEMBER_COUPON_REPOSITORY,
      useClass: MemberCouponRepository
    }
  ],
  exports: [CouponService],
})
export class CouponModule {}
