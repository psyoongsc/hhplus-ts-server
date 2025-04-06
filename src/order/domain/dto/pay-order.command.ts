import { IsInt, IsPositive } from "class-validator";

export class PayOrderCommand {
  @IsInt()
  @IsPositive()
  orderId: number;

  @IsInt()
  @IsPositive()
  couponId: number;
}
