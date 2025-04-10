import { IsInt, IsPositive, Max } from "class-validator";

export class ProcessPaymentReqDto {
  @IsInt()
  @IsPositive()
  @Max(2_147_483_647)
  orderId: number;

  @IsInt()
  @IsPositive()
  @Max(2_147_483_647)
  memberId: number;

  @IsInt()
  @IsPositive()
  @Max(2_147_483_647)
  couponId: number;
}
