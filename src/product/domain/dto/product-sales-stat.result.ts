import { IsInt, IsPositive, Min } from "class-validator";

export class ProductSalesStatResult {
  @IsInt()
  @IsPositive()
  rank: number;

  @IsInt()
  @IsPositive()
  productId: number;
  productName: string;

  @IsInt()
  @IsPositive()
  amount: number;

  @IsInt()
  @Min(0)
  sales: number;
}
