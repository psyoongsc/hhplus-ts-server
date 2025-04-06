import { IsInt, IsString } from "class-validator";

export class CouponResult {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  offFigure: number;

  @IsInt()
  stock: number;
}
