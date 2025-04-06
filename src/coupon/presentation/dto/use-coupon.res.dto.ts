import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsPositive, IsString } from "class-validator";

export class UseCouponResDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: "1", description: "발행 쿠폰 식별자" })
  id: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ example: "1", description: "회원 식별자" })
  memberId: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ example: "2", description: "쿠폰 식별자" })
  couponId: number;

  @IsString()
  @ApiProperty({ example: "15% 할인 쿠폰", description: "쿠폰명" })
  couponName: string;

  @IsInt()
  @IsPositive()
  @ApiProperty({ example: "15", description: "할인율" })
  offFigure: number;

  @IsBoolean()
  @Type(() => Boolean)
  @IsIn([true, false])
  @ApiProperty({ example: "true", description: "사용 여부" })
  isUsed: boolean;
}
