import { PrismaModule } from "@app/database/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { PaymentController } from "./presentation/payment.controller";
import { PaymentService } from "./domain/service/payment.service";
import { PaymentRepository } from "./domain/infrastructure/payment.repository";
import { IPAYMENT_REPOSITORY } from "./domain/payment.repository.interface";
import { MemberModule } from "@app/member/member.module";
import { OrderModule } from "@app/order/order.module";
import { ProductModule } from "@app/product/product.module";
import { ProductSalesStatModule } from "@app/productSalesStat/productSalesStat.module";
import { PaymentFacade } from "./domain/application/payment.facade";

@Module({
  imports: [PrismaModule, MemberModule, OrderModule, ProductModule, ProductSalesStatModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentFacade,
    {
      provide: IPAYMENT_REPOSITORY,
      useClass: PaymentRepository,
    },
  ],
})
export class PaymentModule {}
