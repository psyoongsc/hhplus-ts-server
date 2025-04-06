import { IsInt, IsPositive } from "class-validator";

export class ChargeBalanceCommand {
  @IsInt()
  @IsPositive()
  memberId: number;

  @IsInt()
  @IsPositive()
  amount: number;
}
