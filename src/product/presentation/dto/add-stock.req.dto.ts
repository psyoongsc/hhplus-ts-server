import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class AddStockReqDto {
  @IsInt()
  @ApiProperty({ example: "1", description: "상품 식별자" })
  productId: number;

  @IsInt()
  @ApiProperty({ example: "10", description: "추가 할 재고량" })
  amount: number;
}
