import { IRepository } from "@app/database/repository.interface";
import { Coupon } from "@prisma/client";

export interface ICouponRepository extends IRepository<Coupon> {
  getAllAvailableCoupons(): Promise<Coupon[]>
  addCoupon(couponId: number): Promise<Coupon>;
  deductCoupon(couponId: number): Promise<Coupon>;
}

export const ICOUPON_REPOSITORY = Symbol("ICOUPON_REPOSITORY");