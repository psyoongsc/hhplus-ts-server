import { IRepository } from "@app/database/repository.interface";
import { Coupon, Prisma } from "@prisma/client";

export interface ICouponRepository extends IRepository<Coupon> {
  getAllAvailableCoupons(tx?: Prisma.TransactionClient): Promise<Coupon[]>
  addCoupon(couponId: number, tx?: Prisma.TransactionClient): Promise<Coupon>;
  deductCoupon(couponId: number, tx?: Prisma.TransactionClient): Promise<Coupon>;
}

export const ICOUPON_REPOSITORY = Symbol("ICOUPON_REPOSITORY");