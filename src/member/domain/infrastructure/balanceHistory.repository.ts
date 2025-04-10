import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Injectable } from "@nestjs/common";
import { Balance_History } from "../entity/balance_history.entity";
import { PrismaService } from "@app/database/prisma/prisma.service";
import { IBalanceRepository } from "../balanceHistory.repository.interface";

@Injectable()
export class BalanceHisotryRepository extends PrismaRepository<Balance_History> implements IBalanceRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.balance_History);
  }

  async addHistory(memberId, amount): Promise<Balance_History> {
    return await this.create({ memberId, amount });
  }
}
