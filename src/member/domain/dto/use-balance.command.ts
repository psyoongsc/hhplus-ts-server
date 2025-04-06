import { IsInt } from "class-validator";

export class UseBalanceCommand {
  @IsInt()
  memberId: number;

  @IsInt()
  amount: number;
}
