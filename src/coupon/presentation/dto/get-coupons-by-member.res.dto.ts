import { MemberCouponResult } from "@app/coupon/domain/dto/member_coupon.result";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray } from "class-validator";

export class GetCouponByMemberResDto {
  @IsArray()
  @Type(() => MemberCouponResult)
  @ApiProperty({
    example: [
      { id: 1, memberId: 1, couponId: 1, couponName: "10% 할인 쿠폰", offFigure: 10, isUsed: false },
      { id: 2, memberId: 1, couponId: 2, couponName: "15% 할인 쿠폰", offFigure: 15, isUsed: true },
    ],
    description: "보유 쿠폰 리스트",
  })
  coupons: MemberCouponResult[];
}
