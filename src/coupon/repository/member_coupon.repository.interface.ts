import { IRepository } from "@app/database/repository.interface";
import { Member_Coupon } from "@prisma/client";

export interface IMemberCouponRepository extends IRepository<Member_Coupon> {
  issueCoupon(memberId: number, couponId: number): Promise<Member_Coupon>;
  useCoupon(memberId: number, couponId: number): Promise<Member_Coupon>;
  getCouponsByMember(memberId: number): Promise<Member_Coupon[]>;
  getCouponsByMemberAndCoupon(memberId: number, couponId: number): Promise<Member_Coupon>;
}

export const IMEMBER_COUPON_REPOSITORY = Symbol("IMEMBER_COUPON_REPOSITORY");