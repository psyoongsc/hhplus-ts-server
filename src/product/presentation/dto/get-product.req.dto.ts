import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class GetProductReqDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: "1", description: "상품 식별자" })
  productId: number;
}
