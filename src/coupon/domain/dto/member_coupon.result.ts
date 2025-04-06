import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsPositive, IsString } from "class-validator";

export class MemberCouponResult {
  @IsInt()
  @IsPositive()
  id: number;

  @IsInt()
  @IsPositive()
  memberId: number;

  @IsInt()
  @IsPositive()
  couponId: number;

  @IsString()
  couponName: string;

  @IsInt()
  @IsPositive()
  offFigure: number;

  @IsBoolean()
  @Type(()=>Boolean)
  @IsIn([true, false])
  isUsed: boolean;
}
