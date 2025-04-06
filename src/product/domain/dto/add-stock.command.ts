import { IsInt, IsPositive } from "class-validator";

export class AddStockCommand {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  amount: number;
}
