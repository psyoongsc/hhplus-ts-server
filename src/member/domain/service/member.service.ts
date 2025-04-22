import { Inject, Injectable } from "@nestjs/common";
import { BalanceResult } from "../dto/balance.result.dto";
import { GetBalanceCommand } from "../dto/get-balance.command.dto";
import { ChargeBalanceCommand } from "../dto/charge-balance.command.dto";
import { UseBalanceCommand } from "../dto/use-balance.command.dto";
import { MemberRepository } from "../../infrastructure/member.repository";
import { BalanceHisotryRepository } from "../../infrastructure/balanceHistory.repository";
import { IMEMBER_REPOSITORY } from "../repository/member.repository.interface";
import { IBALANCE_HISTORY_REPOSITORY } from "../repository/balanceHistory.repository.interface";
import { TransactionService } from "@app/database/prisma/transaction.service";
import { Member, Prisma } from "@prisma/client";

@Injectable()
export class MemberService {
  constructor(
    @Inject(IMEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
    @Inject(IBALANCE_HISTORY_REPOSITORY)
    private readonly balanceHistoryRepository: BalanceHisotryRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async getBalance(command: GetBalanceCommand, txc?: Prisma.TransactionClient): Promise<BalanceResult> {
    const memberId: number = command.memberId;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      const result: Member = await this.memberRepository.findById(memberId, client);

      if (result === null) {
        throw Error("MEMBER_NOT_FOUND");
      }

      const balanceResult: BalanceResult = {
        memberId: result.id,
        balance: result.balance,
      };

      return balanceResult;
    });
  }

  async chargeBalance(command: ChargeBalanceCommand, txc?: Prisma.TransactionClient): Promise<BalanceResult> {
    const memberId = command.memberId;
    const amount = command.amount;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      const member: Member = await this.memberRepository.findById(memberId, client);
      if (member === null) {
        throw Error("MEMBER_NOT_FOUND");
      }
      if (member.balance + amount > 2_147_483_647) {
        throw Error("OVER_BALANCE_LIMIT");
      }
  
      const result: Member = await this.memberRepository.updateBalanceWithOptimisticLock(memberId, member.balance + amount, member.version, client);
      await this.balanceHistoryRepository.addHistory(memberId, amount, client);
  
      const balanceResult: BalanceResult = {
        memberId: result.id,
        balance: result.balance,
      };
  
      return balanceResult;
    });

  }

  async useBalance(command: UseBalanceCommand, txc?: Prisma.TransactionClient): Promise<BalanceResult> {
    const memberId = command.memberId;
    const amount = command.amount;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      const member: Member = await this.memberRepository.findById(memberId, client);
      if (member === null) {
        throw Error("MEMBER_NOT_FOUND");
      }
      if (member.balance < amount) {
        throw Error("NOT_ENOUTH_BALANCE");
      }
  
      const result: Member = await this.memberRepository.updateBalanceWithOptimisticLock(memberId, member.balance - amount, member.version, client);
      await this.balanceHistoryRepository.addHistory(memberId, -1 * amount, client);
  
      const balanceResult: BalanceResult = {
        memberId: result.id,
        balance: result.balance,
      };
  
      return balanceResult;
    });

  }
}
