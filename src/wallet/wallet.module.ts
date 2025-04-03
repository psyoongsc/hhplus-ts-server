import { Module } from "@nestjs/common";
import { WalletService } from "./domain/service/wallet.service";
import { WalletController } from "./presentation/wallet.controller";

@Module({
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
