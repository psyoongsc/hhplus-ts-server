import { Inject, Injectable } from "@nestjs/common";
import { ProductResult } from "../dto/product.result.dto";
import { GetProductCommand } from "../dto/get-product.command.dto";
import { AddStockCommand } from "../dto/add-stock.command.dto";
import { DeductStockCommand } from "../dto/deduct-stock.command.dto";
import { ProductRepository } from "../../infrastructure/product.repository";
import { Product } from "@prisma/client";
import { IPRODUCT_REPOSITORY } from "../repository/product.repository.interface";

@Injectable()
export class ProductService {
  constructor(
    @Inject(IPRODUCT_REPOSITORY)
    protected readonly productRepository: ProductRepository,
  ) {}

  async getAllProducts(): Promise<ProductResult[]> {
    return await this.productRepository.findAll();
  }

  async getProduct(command: GetProductCommand): Promise<ProductResult> {
    const productId = command.productId;

    const result: Product = await this.productRepository.findById(productId);
    if (result === null) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    return result;
  }

  async addProductStock(command: AddStockCommand): Promise<ProductResult> {
    const productId = command.productId;
    const amount = command.amount;

    const product: Product = await this.productRepository.findById(productId);
    if (product === null) {
      throw new Error("PRODUCT_NOT_FOUND");
    }
    if (product.stock + amount > 2_147_483_647) {
      throw new Error("OVER_STOCK_LIMIT");
    }

    const result: Product = await this.productRepository.updateStock(productId, product.stock + amount);

    return result;
  }

  async deductProductStock(command: DeductStockCommand): Promise<ProductResult> {
    const productId = command.productId;
    const amount = command.amount;

    const product: Product = await this.productRepository.findById(productId);
    if (product === null) {
      throw new Error("PRODUCT_NOT_FOUND");
    }
    if (product.stock < amount) {
      throw new Error("NOT_ENOUGH_STOCK");
    }

    const result: Product = await this.productRepository.updateStock(productId, product.stock - amount);

    return result;
  }
}
