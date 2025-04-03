import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class ChargeBalanceControllerResDto {
  @IsInt()
  @ApiProperty({ example: 1, description: "회원 식별자" })
  memberId: number;

  @IsInt()
  @ApiProperty({ example: 5500, description: "충전 후 잔액" })
  balance: number;
}
