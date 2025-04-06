import { OrderStatus } from "@app/order/domain/dto/order-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class CancelOrderResDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 1, description: "주문 식별자" })
  id: number;

  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 1, description: "회원 식별자" })
  memberId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: null, description: "쿠폰 식별자" })
  couponId: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 2424900, description: "총 가격" })
  totalSales: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 2424900, description: "할인 가격" })
  discountedSales: number;

  @IsEnum(OrderStatus)
  @ApiProperty({ example: OrderStatus.ORDER_CANCEL, description: "주문 상태" })
  status: OrderStatus;
}
