import { Module } from "@nestjs/common";
import { MemberModule } from "./member/member.module";
import { CouponModule } from "./coupon/coupon.module";
import { ProductModule } from "./product/product.module";
import { OrderModule } from "./order/order.module";
import { ProductSalesStatModule } from "./productSalesStat/productSalesStat.module";
import { PaymentModule } from "./payment/payment.module";

@Module({
  imports: [MemberModule, CouponModule, ProductModule, OrderModule, ProductSalesStatModule, PaymentModule],
})
export class AppModule {}
