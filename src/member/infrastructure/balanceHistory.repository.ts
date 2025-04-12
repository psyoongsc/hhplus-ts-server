import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@app/database/prisma/prisma.service";
import { IBalanceRepository } from "../domain/repository/balanceHistory.repository.interface";
import { Balance_History } from "@prisma/client";

@Injectable()
export class BalanceHisotryRepository extends PrismaRepository<Balance_History> implements IBalanceRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.balance_History);
  }

  async addHistory(memberId, amount): Promise<Balance_History> {
    return await this.prisma.balance_History.create({
      data: {
        memberId,
        amount
      }
    });
  }
}
