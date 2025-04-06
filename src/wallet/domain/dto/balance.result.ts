import { IsInt } from "class-validator";

export class BalanceResult {
  @IsInt()
  memberId: number;

  @IsInt()
  balance: number;
}
