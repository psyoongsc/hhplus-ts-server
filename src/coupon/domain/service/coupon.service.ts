import { Injectable } from "@nestjs/common";
import { IssueCouponCommand } from "../dto/issue-coupon.command";
import { UseCouponCommand } from "../dto/use-coupon.command";
import { GetCouponsByMemberCommand } from "../dto/get-coupons-by-member.command";
import { CouponResult } from "../dto/coupon.result";
import { MemberCouponResult } from "../dto/member_coupon.result";

@Injectable()
export class CouponService {
  async getAllCoupons(): Promise<CouponResult[]> {
    const coupons: CouponResult[] = [
      { id: 1, name: "10% 할인 쿠폰", offFigure: 10, stock: 5 },
      { id: 2, name: "15% 할인 쿠폰", offFigure: 15, stock: 2 },
    ];

    return coupons;
  }

  async issue(command: IssueCouponCommand): Promise<MemberCouponResult> {
    const memberId = command.memberId;
    const couponId = command.couponId;

    return { id: 1, memberId: memberId, couponId: 1, couponName: "10% 할인 쿠폰", offFigure: 10, isUsed: false };
  }

  async use(command: UseCouponCommand): Promise<MemberCouponResult> {
    const memberId = command.memberId;
    const couponId = command.couponId;

    return { id: 2, memberId: memberId, couponId: 2, couponName: "15% 할인 쿠폰", offFigure: 15, isUsed: true };
  }

  async getCouponsByMember(command: GetCouponsByMemberCommand): Promise<MemberCouponResult[]> {
    const memberId = command.memberId;

    return [
      { id: 1, memberId: memberId, couponId: 1, couponName: "10% 할인 쿠폰", offFigure: 10, isUsed: false },
      { id: 2, memberId: memberId, couponId: 2, couponName: "15% 할인 쿠폰", offFigure: 15, isUsed: true },
    ];
  }
}
