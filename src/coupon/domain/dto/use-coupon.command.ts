import { IsInt, IsPositive } from "class-validator";

export class UseCouponCommand {
  @IsInt()
  @IsPositive()
  memberId: number;

  @IsInt()
  @IsPositive()
  couponId: number;
}
