import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Member } from "../entity/member.entity";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@app/database/prisma/prisma.service";
import { IMemberRepository } from "../member.repository.interface";

@Injectable()
export class MemberRepository extends PrismaRepository<Member> implements IMemberRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.member);
  }

  async updateBalance(id: number, balance: number): Promise<Member> {
    return await this.updateById(id, { balance });
  }
}
