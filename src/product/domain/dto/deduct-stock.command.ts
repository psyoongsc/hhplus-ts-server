import { IsInt, IsPositive } from "class-validator";

export class DeductStockCommand {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @IsPositive()
  amount: number;
}
