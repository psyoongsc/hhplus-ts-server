import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class GetBalanceControllerResDto {
  @IsInt()
  @ApiProperty({ example: 1, description: "회원 식별자" })
  memberId: number;

  @IsInt()
  @ApiProperty({ example: 5000, description: "잔액" })
  balance: number;
}
