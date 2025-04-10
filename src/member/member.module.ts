import { Module } from "@nestjs/common";
import { MemberService } from "./domain/service/member.service";
import { MemberController } from "./presentation/member.controller";
import { MemberRepository } from "./domain/infrastructure/memeber.repository";
import { PrismaModule } from "@app/database/prisma/prisma.module";
import { BalanceHisotryRepository } from "./domain/infrastructure/balanceHistory.repository";
import { IMEMBER_REPOSITORY } from "./domain/member.repository.interface";
import { IBALANCE_HISTORY_REPOSITORY } from "./domain/balanceHistory.repository.interface";

@Module({
  imports: [PrismaModule],
  controllers: [MemberController],
  providers: [
    MemberService,
    {
      provide: IMEMBER_REPOSITORY,
      useClass: MemberRepository,
    },
    {
      provide: IBALANCE_HISTORY_REPOSITORY,
      useClass: BalanceHisotryRepository,
    },
  ],
  exports: [MemberService],
})
export class MemberModule {}
