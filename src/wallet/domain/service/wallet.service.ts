import { Injectable } from "@nestjs/common";
import { BalanceResult } from "../dto/balance.result";
import { GetBalanceCommand } from "../dto/get-balance.command";
import { ChargeBalanceCommand } from "../dto/charge-balance.command";
import { UseBalanceCommand } from "../dto/use-balance.command";

@Injectable()
export class WalletService {
  async getBalance(command: GetBalanceCommand): Promise<BalanceResult> {
    const memberId = command.memberId;

    return { memberId: memberId, balance: 5000 };
  }

  async charge(command: ChargeBalanceCommand): Promise<BalanceResult> {
    const memberId = command.memberId;
    const amount = command.amount;

    return { memberId: memberId, balance: 5000 + amount };
  }

  async use(command: UseBalanceCommand): Promise<BalanceResult> {
    const memberId = command.memberId;
    const amount = command.amount;

    return { memberId: memberId, balance: 5000 - amount };
  }
}
