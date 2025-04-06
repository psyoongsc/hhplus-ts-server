import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive, Min } from "class-validator";

export class ChargeBalanceControllerResDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 1, description: "회원 식별자" })
  memberId: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 5500, description: "충전 후 잔액" })
  balance: number;
}
