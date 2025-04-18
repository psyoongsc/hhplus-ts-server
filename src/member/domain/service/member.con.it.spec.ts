import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { IMEMBER_REPOSITORY, IMemberRepository } from '../repository/member.repository.interface';
import { IBALANCE_HISTORY_REPOSITORY, IBalanceRepository } from '../repository/balanceHistory.repository.interface';
import { MemberRepository } from '../../infrastructure/member.repository';
import { BalanceHisotryRepository } from '../../infrastructure/balanceHistory.repository';
import { PrismaService } from '@app/database/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { ChargeBalanceCommand } from '../dto/charge-balance.command.dto';
import { GetBalanceCommand } from '../dto/get-balance.command.dto';
import { UseBalanceCommand } from '../dto/use-balance.command.dto';
import { TransactionService } from '@app/database/prisma/transaction.service';

describe('MemberService Concurrency Test', () => {
  let memberService: MemberService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        TransactionService,
        MemberService,
        {
          provide: IMEMBER_REPOSITORY,
          useClass: MemberRepository,
        },
        {
          provide: IBALANCE_HISTORY_REPOSITORY,
          useClass: BalanceHisotryRepository,
        },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    const importSqlPath = path.resolve(__dirname, 'integration-test-util/import_concurrency.sql');
    const sql = fs.readFileSync(importSqlPath, 'utf8');
  
    // 여러 SQL 문장을 실행할 수 있도록 분리
    const statements = sql.split(';').map(stmt => stmt.trim()).filter(stmt => stmt);
  
    for (const statement of statements) {
      await prisma.$executeRawUnsafe(statement);
    }
  })

  afterEach(async() => {
    await prisma.balance_History.deleteMany({});
    await prisma.member.deleteMany({});
  })

  describe("useBalance", () => {
    it("10000원을 가진 사용자가 5000원 사용을 동시에 5번 시도하면 2번만 성공해야 함", async () => {
      const result = await Promise.allSettled([
        memberService.useBalance({memberId: 1, amount: 5000}),
        memberService.useBalance({memberId: 1, amount: 5000}),
        memberService.useBalance({memberId: 1, amount: 5000}),
        memberService.useBalance({memberId: 1, amount: 5000}),
        memberService.useBalance({memberId: 1, amount: 5000}),
      ])

      const success_count = result.map((item) => item.status === "fulfilled").length;
      const afterBalance = await prisma.member.findUnique({select: {balance: true}, where: {id: 1}});

      expect(afterBalance.balance).toBe(0);
      expect(success_count).toBe(2);
    })
  })

  describe("chargeBalance", () => {
    it("0원을 가진 사용자가 5000원 사용을 동시에 5번 시도하면 25000원이 있어야 함", async () => {
      const result = await Promise.allSettled([
        memberService.chargeBalance({memberId: 1, amount: 5000}),
        memberService.chargeBalance({memberId: 1, amount: 5000}),
        memberService.chargeBalance({memberId: 1, amount: 5000}),
        memberService.chargeBalance({memberId: 1, amount: 5000}),
        memberService.chargeBalance({memberId: 1, amount: 5000}),
      ])

      const afterBalance = await prisma.member.findUnique({select: {balance: true}, where: {id: 1}});

      expect(afterBalance.balance).toBe(25000);
    })
  })
});
