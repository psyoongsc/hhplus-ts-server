import { IsInt, IsPositive, IsString, Min } from "class-validator";

export class ProductResult {
  @IsInt()
  @IsPositive()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  stock: number;

  @IsInt()
  @Min(0)
  price: number;
}
