import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class GetProductReqDto {
  @IsInt()
  @ApiProperty({ example: "1", description: "상품 식별자" })
  productId: number;
}
