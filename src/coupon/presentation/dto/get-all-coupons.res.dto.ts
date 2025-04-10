import { CouponResult } from "@app/coupon/domain/dto/coupon.result";
import { ApiProperty } from "@nestjs/swagger";

export class GetAllCouponsResDto {
  @ApiProperty({
    example: [
      { id: 1, name: "10% 할인 쿠폰", offFigure: 10, stock: 5 },
      { id: 2, name: "15% 할인 쿠폰", offFigure: 15, stock: 2 },
    ],
    description: "쿠폰 리스트",
  })
  coupons: CouponResult[];
}
