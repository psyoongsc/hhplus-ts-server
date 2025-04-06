import { IsInt } from "class-validator";

export class OrderProductCommand {
  @IsInt()
  memberId: number;

  products: Product[];
}

export class Product {
  @IsInt()
  id: number;

  @IsInt()
  amount: number;
}
