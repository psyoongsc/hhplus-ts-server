import { IsInt, IsPositive } from "class-validator";

export class CancelOrderCommand {
  @IsInt()
  @IsPositive()
  orderId: number;
}
