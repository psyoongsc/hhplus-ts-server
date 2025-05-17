import { Inject, Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { ICOUPON_REPOSITORY } from "../repository/coupon.repository.interface";
import { CouponRepository } from "@app/coupon/infrastructure/coupon.repository";
import { CouponRedisService } from "./coupon.redis.service";

@Injectable()
export class CouponSchedulerService {
  constructor(
    @Inject(ICOUPON_REPOSITORY)
    private readonly couponRepository: CouponRepository,
    private readonly couponRedisService: CouponRedisService
  ) {}

  @Cron('*/2 * * * * *')
  async processIssueAllCoupons() {
    const coupons = await this.couponRepository.getAllAvailableCoupons();

    for(const coupon of coupons) {
      await this.couponRedisService.processIssueCoupon(coupon.id);
    }
  }
}