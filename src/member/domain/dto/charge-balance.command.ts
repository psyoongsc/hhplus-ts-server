import { IsInt } from "class-validator";

export class ChargeBalanceCommand {
  @IsInt()
  memberId: number;

  @IsInt()
  amount: number;
}
