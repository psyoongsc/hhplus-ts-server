import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@app/database/prisma/prisma.service";
import { IMemberRepository } from "../domain/repository/member.repository.interface";
import { Member } from "@prisma/client";

@Injectable()
export class MemberRepository extends PrismaRepository<Member> implements IMemberRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.member);
  }

  async updateBalance(id: number, balance: number): Promise<Member> {
    return await this.updateById(id, { balance });
  }
}
