import { IsInt, IsPositive } from "class-validator";

export class GetProductCommand {
  @IsInt()
  @IsPositive()
  productId: number;
}
