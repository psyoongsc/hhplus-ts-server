import { IsInt, IsPositive, Min } from "class-validator";

export class UseBalanceCommand {
  @IsInt()
  @IsPositive()
  memberId: number;

  @IsInt()
  @Min(0)
  amount: number;
}
