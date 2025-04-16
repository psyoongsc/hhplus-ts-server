import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@app/database/prisma/prisma.service";
import { IMemberRepository } from "../domain/repository/member.repository.interface";
import { Member, Prisma } from "@prisma/client";

@Injectable()
export class MemberRepository extends PrismaRepository<Member> implements IMemberRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, (client) => client.member);
  }

  async updateBalance(id: number, balance: number, tx?: Prisma.TransactionClient): Promise<Member> {
    const client = tx ?? this.prisma;
    
    return await this.updateById(id, { balance }, client);
  }
}
