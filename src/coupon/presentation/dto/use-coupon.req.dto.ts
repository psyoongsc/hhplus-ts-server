import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class UseCouponReqDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: "1", description: "회원 식별자" })
  memberId: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ example: "2", description: "쿠폰 식별자" })
  couponId: number;
}
