import { IsInt, IsPositive } from "class-validator";

export class IssueCouponCommand {
  @IsInt()
  @IsPositive()
  memberId: number;

  @IsInt()
  @IsPositive()
  couponId: number;
}
