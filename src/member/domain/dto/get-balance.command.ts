import { IsInt, IsPositive } from "class-validator";

export class GetBalanceCommand {
  @IsInt()
  @IsPositive()
  memberId: number;
}
