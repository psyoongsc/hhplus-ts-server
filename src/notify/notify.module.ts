import { Module } from "@nestjs/common";
import { NotifyService } from "./domain/service/notify.service";
import { PayCompletedListener } from "./application/event-listener/pay-completed.listener";
import { SendOrderInfoToExtPlatformUsecase } from "./application/send-order-info-to-ext-platform.usecase";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
  imports: [CqrsModule],
  controllers: [],
  providers: [
    NotifyService, 
    SendOrderInfoToExtPlatformUsecase,
    PayCompletedListener
  ],
  exports: []
})
export class NotifyModule {}