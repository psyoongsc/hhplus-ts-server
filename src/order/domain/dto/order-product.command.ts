import { Type } from "class-transformer";
import { IsArray, IsInt, IsPositive } from "class-validator";

export class OrderProductCommand {
  @IsInt()
  @IsPositive()
  memberId: number;

  @IsArray()
  @Type(()=>Product)
  products: Product[];
}

export class Product {
  @IsInt()
  @IsPositive()
  id: number;

  @IsInt()
  @IsPositive()
  amount: number;
}
