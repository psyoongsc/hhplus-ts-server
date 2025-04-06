import { Module } from "@nestjs/common";
import { MemberService } from "./domain/service/member.service";
import { MemberController } from "./presentation/member.controller";

@Module({
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
