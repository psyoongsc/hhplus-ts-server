import { Inject, Injectable } from "@nestjs/common";
import { BalanceResult } from "../dto/balance.result";
import { GetBalanceCommand } from "../dto/get-balance.command";
import { ChargeBalanceCommand } from "../dto/charge-balance.command";
import { UseBalanceCommand } from "../dto/use-balance.command";
import { MemberRepository } from "../infrastructure/memeber.repository";
import { Member } from "../entity/member.entity";
import { BalanceHisotryRepository } from "../infrastructure/balanceHistory.repository";
import { IMEMBER_REPOSITORY } from "../member.repository.interface";
import { IBALANCE_HISTORY_REPOSITORY } from "../balanceHistory.repository.interface";

@Injectable()
export class MemberService {
  constructor(
    @Inject(IMEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepository,
    @Inject(IBALANCE_HISTORY_REPOSITORY)
    private readonly balanceHistoryRepository: BalanceHisotryRepository,
  ) {}

  async getBalance(command: GetBalanceCommand): Promise<BalanceResult> {
    const memberId: number = command.memberId;

    const result: Member = await this.memberRepository.findById(memberId);

    if (result === null) {
      throw Error("MEMBER_NOT_FOUND");
    }

    const balanceResult: BalanceResult = {
      memberId: result.id,
      balance: result.balance,
    };

    return balanceResult;
  }

  async charge(command: ChargeBalanceCommand): Promise<BalanceResult> {
    const memberId = command.memberId;
    const amount = command.amount;

    const member: Member = await this.memberRepository.findById(memberId);
    if (member === null) {
      throw Error("MEMBER_NOT_FOUND");
    }
    if (member.balance + amount > 2_147_483_647) {
      throw Error("OVER_BALANCE_LIMIT");
    }

    const result: Member = await this.memberRepository.updateBalance(memberId, member.balance + amount);
    await this.balanceHistoryRepository.addHistory(memberId, amount);

    const balanceResult: BalanceResult = {
      memberId: result.id,
      balance: result.balance,
    };

    return balanceResult;
  }

  async use(command: UseBalanceCommand): Promise<BalanceResult> {
    const memberId = command.memberId;
    const amount = command.amount;

    const member: Member = await this.memberRepository.findById(memberId);
    if (member === null) {
      throw Error("MEMBER_NOT_FOUND");
    }
    if (member.balance < amount) {
      throw Error("NOT_ENOUTH_BALANCE");
    }

    const result: Member = await this.memberRepository.updateBalance(memberId, member.balance - amount);
    await this.balanceHistoryRepository.addHistory(memberId, -1 * amount);

    const balanceResult: BalanceResult = {
      memberId: result.id,
      balance: result.balance,
    };

    return balanceResult;
  }
}
