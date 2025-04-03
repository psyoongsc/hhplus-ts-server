import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsString } from "class-validator";

export class IssueCouponResDto {
  @IsInt()
  @ApiProperty({ example: "1", description: "발행 쿠폰 식별자" })
  id: number;

  @IsInt()
  @ApiProperty({ example: "1", description: "회원 식별자" })
  memberId: number;

  @IsInt()
  @ApiProperty({ example: "1", description: "쿠폰 식별자" })
  couponId: number;

  @IsString()
  @ApiProperty({ example: "10% 할인 쿠폰", description: "쿠폰명" })
  couponName: string;

  @IsInt()
  @ApiProperty({ example: "10", description: "할인율" })
  offFigure: number;

  @IsBoolean()
  @ApiProperty({ example: "false", description: "사용 여부" })
  isUsed: boolean;
}
