import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class CancelOrderReqDto {
  @IsInt()
  @ApiProperty({ example: 1, description: "주문 식별자" })
  orderId: number;
}
