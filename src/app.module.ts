import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { WalletModule } from "./wallet/wallet.module";
import { CouponModule } from "./coupon/coupon.module";
import { ProductModule } from "./product/product.module";
import { OrderModule } from "./order/order.module";

@Module({
  imports: [WalletModule, CouponModule, ProductModule, OrderModule],
})
export class AppModule {}
