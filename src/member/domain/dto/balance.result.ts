import { IsInt, IsPositive, Min } from "class-validator";

export class BalanceResult {
  @IsInt()
  @IsPositive()
  memberId: number;

  @IsInt()
  @Min(0)
  balance: number;
}
