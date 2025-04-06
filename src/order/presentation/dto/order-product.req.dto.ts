import { Product } from "@app/order/domain/dto/order-product.command";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsPositive } from "class-validator";

export class OrderProductReqDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({ example: 1, description: "회원 식별자" })
  memberId: number;

  @IsArray()
  @Type(() => Product)
  @ApiProperty({
    example: [
      { productId: 1, amount: 2 },
      { productId: 3, amount: 1 },
    ],
    description: "주문 할 상품 리스트",
  })
  products: Product[];
}
