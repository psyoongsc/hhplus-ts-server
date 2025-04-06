import { Module } from "@nestjs/common";
import { MemberService } from "./domain/service/member.service";
import { MemberController } from "./presentation/member.controller";
import { MemberRepository } from "./domain/memeber.repository";

@Module({
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
})
export class MemberModule {}
