import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive } from "class-validator";

export class PayOrderReqDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 1, description: "주문 식별자" })
  orderId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 1, description: "쿠폰 식별자" })
  couponId: number;
}
