import { Module } from "@nestjs/common";
import { MemberModule } from "./member/member.module";
import { CouponModule } from "./coupon/coupon.module";
import { ProductModule } from "./product/product.module";
import { OrderModule } from "./order/order.module";
import { ProductSalesStatModule } from "./productSalesStat/productSalesStat.module";
import { PaymentModule } from "./payment/payment.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ViewRefreshService } from "./common/schedules/view-refresh.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { DuplicateRequestInterceptor } from "./common/interceptors/duplicate-request.interceptor";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [
    MemberModule, 
    CouponModule, 
    ProductModule, 
    OrderModule, 
    ProductSalesStatModule, 
    PaymentModule,
    ScheduleModule.forRoot(),
    RedisModule
  ],
  providers: [
    ViewRefreshService,
    {
      provide: APP_INTERCEPTOR,
      useClass: DuplicateRequestInterceptor,
    },
  ],
})
export class AppModule {}
