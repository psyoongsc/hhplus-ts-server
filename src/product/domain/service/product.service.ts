import { Inject, Injectable } from "@nestjs/common";
import { ProductResult } from "../dto/product.result.dto";
import { GetProductCommand } from "../dto/get-product.command.dto";
import { AddStockCommand } from "../dto/add-stock.command.dto";
import { DeductStockCommand } from "../dto/deduct-stock.command.dto";
import { ProductRepository } from "../../infrastructure/product.repository";
import { Prisma, Product } from "@prisma/client";
import { IPRODUCT_REPOSITORY } from "../repository/product.repository.interface";
import { TransactionService } from "@app/database/prisma/transaction.service";

@Injectable()
export class ProductService {
  constructor(
    @Inject(IPRODUCT_REPOSITORY)
    protected readonly productRepository: ProductRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async getAllProducts(txc?: Prisma.TransactionClient): Promise<ProductResult[]> {
    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      return await this.productRepository.findAll(client);
    });
  }

  async getProduct(command: GetProductCommand, txc?: Prisma.TransactionClient): Promise<ProductResult> {
    const productId = command.productId;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      const result: Product = await this.productRepository.findById(productId, client);
      if (result === null) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      return result;
    });
  }

  async addProductStock(command: AddStockCommand, txc?: Prisma.TransactionClient): Promise<ProductResult> {
    const productId = command.productId;
    const amount = command.amount;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      const product: Product = await this.productRepository.findByIdWithPessimisticLock(productId, client);
      if (product === null) {
        throw new Error("PRODUCT_NOT_FOUND");
      }
      if (product.stock + amount > 2_147_483_647) {
        throw new Error("OVER_STOCK_LIMIT");
      }

      const result: Product = await this.productRepository.updateStock(productId, product.stock + amount, client);

      return result;
    });
  }

  async deductProductStock(command: DeductStockCommand, txc?: Prisma.TransactionClient): Promise<ProductResult> {
    const productId = command.productId;
    const amount = command.amount;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      const product: Product = await this.productRepository.findByIdWithPessimisticLock(productId, client);

      if (product === null) {
        throw new Error("PRODUCT_NOT_FOUND");
      }
      if (product.stock < amount) {
        throw new Error("NOT_ENOUGH_STOCK");
      }

      const result: Product = await this.productRepository.updateStock(productId, product.stock - amount, client);

      return result;
    })
  }

  async deductProductStockBulk(commands: DeductStockCommand[], txc?: Prisma.TransactionClient): Promise<number> {
    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      let result = 0;
      for(const command of commands) {
        const deductedProduct = await this.deductProductStock(command, client);
        result += deductedProduct.price * command.amount;
      }

      return result;
    })
  }
}
