import { IsInt, IsPositive, IsString, Min } from "class-validator";

export class CouponResult {
  @IsInt()
  @IsPositive()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  offFigure: number;

  @IsInt()
  @Min(0)
  stock: number;
}
