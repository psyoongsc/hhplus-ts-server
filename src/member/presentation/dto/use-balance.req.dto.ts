import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class UseBalanceControllerReqDto {
  @IsInt()
  @ApiProperty({ example: 1, description: "회원 식별자" })
  memberId: number;

  @IsInt()
  @ApiProperty({ example: 500, description: "사용금액" })
  amount: number;
}
