import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class PayOrderReqDto {
  @IsInt()
  @ApiProperty({ example: 1, description: "주문 식별자" })
  orderId: number;

  @IsInt()
  @ApiProperty({ example: 1, description: "쿠폰 식별자" })
  couponId: number;
}
