import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@app/database/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { ProductService } from './product.service';
import { ProductRepository } from '@app/product/infrastructure/product.repository';
import { IPRODUCT_REPOSITORY } from '../repository/product.repository.interface';
import { TransactionService } from '@app/database/prisma/transaction.service';

describe('ProductService Concurrency Test', () => {
  let productService: ProductService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        TransactionService,
        ProductService,
        {
          provide: IPRODUCT_REPOSITORY,
          useClass: ProductRepository,
        },
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
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
    await prisma.product.deleteMany({});
  })

  describe("addProductStock", () => {
    it("재고가 20개인 상품에 대해서 5개 씩 5번 재고 차감을 하면 4번만 성공해야 함", async () => {
      const result = await Promise.allSettled([
        productService.addProductStock({productId: 2, amount: 5}),
        productService.addProductStock({productId: 2, amount: 5}),
        productService.addProductStock({productId: 2, amount: 5}),
        productService.addProductStock({productId: 2, amount: 5}),
        productService.addProductStock({productId: 2, amount: 5}),
      ])

      const afterStock = await prisma.product.findUnique({select: {stock: true}, where: {id: 2}});

      expect(afterStock.stock).toBe(25);
    })
  })

  describe("deductProductStock", () => {
    it("재고가 20개인 상품에 대해서 5개 씩 5번 재고 차감을 하면 4번만 성공해야 함", async () => {
      const result = await Promise.allSettled([
        productService.deductProductStock({productId: 1, amount: 5}),
        productService.deductProductStock({productId: 1, amount: 5}),
        productService.deductProductStock({productId: 1, amount: 5}),
        productService.deductProductStock({productId: 1, amount: 5}),
        productService.deductProductStock({productId: 1, amount: 5}),
      ])

      const success_count = result.map((item) => item.status === "fulfilled").length;
      const afterStock = await prisma.product.findUnique({select: {stock: true}, where: {id: 1}});

      expect(afterStock.stock).toBe(0);
      expect(success_count).toBe(4);
    })
  })
});
