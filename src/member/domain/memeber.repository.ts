import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Member } from "./entity/member.entity";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@app/database/prisma/prisma.service";

@Injectable()
export class MemberRepository extends PrismaRepository<Member> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.member);
  }

  async updateBalance(id: number, balance: number): Promise<Member> {
    return await this.updateById(id, { balance });
  }
}
