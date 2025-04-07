import { Module } from "@nestjs/common";
import { MemberService } from "./domain/service/member.service";
import { MemberController } from "./presentation/member.controller";
import { MemberRepository } from "./domain/memeber.repository";
import { PrismaModule } from "@app/database/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
})
export class MemberModule {}
