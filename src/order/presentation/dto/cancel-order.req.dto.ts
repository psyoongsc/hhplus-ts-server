import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class CancelOrderReqDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 1, description: "주문 식별자" })
  orderId: number;
}
