import { Module } from "@nestjs/common";
import { NotifyService } from "./domain/service/notify.service";
import { PayCompletedListener } from "./application/event-listener/pay-completed.listener";
import { SendOrderInfoToExtPlatformUsecase } from "./application/send-order-info-to-ext-platform.usecase";
import { KafkaModule } from "@app/kafka/kafka.module";
import { NotifyPayCompletedConsumer } from "./infrastructure/notify-pay-completed.consumer";

@Module({
  imports: [
    KafkaModule
  ],
  controllers: [],
  providers: [
    NotifyService, 
    SendOrderInfoToExtPlatformUsecase,
    NotifyPayCompletedConsumer
  ],
  exports: []
})
export class NotifyModule {}