import { IsInt } from "class-validator";

export class GetBalanceCommand {
  @IsInt()
  memberId: number;
}
