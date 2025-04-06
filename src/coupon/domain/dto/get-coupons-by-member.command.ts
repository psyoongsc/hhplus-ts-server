import { IsInt, IsPositive } from "class-validator";

export class GetCouponsByMemberCommand {
  @IsInt()
  @IsPositive()
  memberId: number;
}
