import { IsInt } from "class-validator";

export class IssueCouponCommand {
  @IsInt()
  memberId: number;

  @IsInt()
  couponId: number;
}
