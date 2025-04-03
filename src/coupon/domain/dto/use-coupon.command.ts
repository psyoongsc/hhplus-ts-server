import { IsInt } from "class-validator";

export class UseCouponCommand {
  @IsInt()
  memberId: number;

  @IsInt()
  couponId: number;
}
