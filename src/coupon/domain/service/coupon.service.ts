import { Inject, Injectable } from "@nestjs/common";
import { IssueCouponCommand } from "../dto/issue-coupon.command";
import { UseCouponCommand } from "../dto/use-coupon.command";
import { GetCouponsByMemberCommand } from "../dto/get-coupons-by-member.command";
import { CouponResult } from "../dto/coupon.result";
import { MemberCouponResult } from "../dto/member_coupon.result";
import { CouponRepository } from "../infrastructure/coupon.repository";
import { MemberCouponRepository } from "../infrastructure/member_coupon.repository";
import { ICOUPON_REPOSITORY } from "../coupon.repository.interface";
import { IMEMBER_COUPON_REPOSITORY } from "../member_coupon.repository.interface";
import { AddCouponCommand } from "../dto/add-coupon.command";
import { DeductCouponCommand } from "../dto/deduct-coupon.command";

@Injectable()
export class CouponService {
  constructor(
    @Inject(ICOUPON_REPOSITORY)
    private readonly couponRepository: CouponRepository,
    @Inject(IMEMBER_COUPON_REPOSITORY)
    private readonly memberCouponRepository: MemberCouponRepository
  ) {}

  async getAllCoupons(): Promise<CouponResult[]> {
    return await this.couponRepository.getAllAvailableCoupons();
  }

  async issueCoupon(command: IssueCouponCommand): Promise<MemberCouponResult> {
    const memberId = command.memberId;
    const couponId = command.couponId;

    const member_coupon = await this.memberCouponRepository.getCouponsByMemberAndCoupon(memberId, couponId);
    if(member_coupon != null) {
      throw new Error("ALREADY_HAVING_COUPON");
    }

    await this.deductCouponStock({couponId});
    return await this.memberCouponRepository.issueCoupon(memberId, couponId);
  }

  async useCoupon(command: UseCouponCommand): Promise<MemberCouponResult> {
    const memberId = command.memberId;
    const couponId = command.couponId;

    const member_coupon = await this.memberCouponRepository.getCouponsByMemberAndCoupon(memberId, couponId);
    if(member_coupon == null) {
      throw new Error("NOT_FOUND_MEMBER_COUPON");
    }
    if(member_coupon.isUsed) {
      throw new Error("ALREADY_USED_COUPON");
    }

    return await this.memberCouponRepository.useCoupon(memberId, couponId);
  }

  async addCouponStock(command: AddCouponCommand): Promise<CouponResult> {
    const couponId = command.couponId;

    const coupon = await this.couponRepository.findById(couponId);
    if(coupon == null) {
      throw new Error("NOT_FOUND_COUPON");
    }
    if(coupon.stock == 2_147_483_647) {
      throw new Error("OVER_COUPON_STOCK_LIMIT")
    }

    return await this.couponRepository.addCoupon(couponId);
  }

  async deductCouponStock(command: DeductCouponCommand): Promise<CouponResult> {
    const couponId = command.couponId;

    const coupon = await this.couponRepository.findById(couponId);
    if(coupon == null) {
      throw new Error("NOT_FOUND_COUPON");
    }
    if(coupon.stock == 0) {
      throw new Error("NOT_ENOUTH_STOCK")
    }

    return await this.couponRepository.deductCoupon(couponId);
  }

  async getCouponsByMember(command: GetCouponsByMemberCommand): Promise<MemberCouponResult[]> {
    const memberId = command.memberId;

    return await this.memberCouponRepository.getCouponsByMember(memberId);
  }
}
