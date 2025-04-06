import { IsEnum, IsInt, IsPositive, Min } from "class-validator";
import { OrderStatus } from "./order-status.enum";

export class OrderResult {
  @IsInt()
  @IsPositive()
  id: number;

  @IsInt()
  @IsPositive()
  memberId: number;

  @IsInt()
  @IsPositive()
  couponId: number;

  @IsInt()
  @Min(0)
  totalSales: number;

  @IsInt()
  @Min(0)
  discountedSales: number;

  @IsEnum(OrderResult)
  status: OrderStatus;
}
