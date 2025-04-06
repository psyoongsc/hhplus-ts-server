import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive, Min } from "class-validator";

export class GetBalanceControllerResDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 1, description: "회원 식별자" })
  memberId: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 5000, description: "잔액" })
  balance: number;
}
