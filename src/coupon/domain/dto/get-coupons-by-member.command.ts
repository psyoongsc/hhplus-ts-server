import { IsInt } from "class-validator";

export class GetCouponsByMemberCommand {
  @IsInt()
  memberId: number;
}
