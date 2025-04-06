import { IsBoolean, IsInt, IsString } from "class-validator";

export class MemberCouponResult {
  @IsInt()
  id: number;

  @IsInt()
  memberId: number;

  @IsInt()
  couponId: number;

  @IsString()
  couponName: string;

  @IsInt()
  offFigure: number;

  @IsBoolean()
  isUsed: boolean;
}
