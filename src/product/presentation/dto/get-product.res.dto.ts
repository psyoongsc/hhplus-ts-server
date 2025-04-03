import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class GetProductResDto {
  @IsInt()
  @ApiProperty({ example: "1", description: "상품 식별자" })
  id: number;

  @IsString()
  @ApiProperty({ example: "다이슨 에어랩", description: "상품명" })
  name: string;

  @IsInt()
  @ApiProperty({ example: "121", description: "재고량" })
  stock: number;

  @IsInt()
  @ApiProperty({ example: "1200000", description: "가격" })
  price: number;
}
