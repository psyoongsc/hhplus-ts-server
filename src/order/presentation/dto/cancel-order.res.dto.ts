import { OrderStatus } from "@app/order/domain/dto/order-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class CancelOrderResDto {
  @IsInt()
  @ApiProperty({ example: 1, description: "주문 식별자" })
  id: number;

  @IsInt()
  @ApiProperty({ example: 1, description: "회원 식별자" })
  memberId: number;

  @IsInt()
  @ApiProperty({ example: NaN, description: "쿠폰 식별자" })
  couponId: number;

  @IsInt()
  @ApiProperty({ example: 2424900, description: "총 가격" })
  totalSales: number;

  @IsInt()
  @ApiProperty({ example: 2424900, description: "할인 가격" })
  discountedSales: number;

  @ApiProperty({ example: OrderStatus.ORDER_CANCEL, description: "주문 상태" })
  status: OrderStatus;
}
