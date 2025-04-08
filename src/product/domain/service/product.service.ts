import { Injectable } from "@nestjs/common";
import { ProductResult } from "../dto/product.result";
import { GetProductCommand } from "../dto/get-product.command";
import { AddStockCommand } from "../dto/add-stock.command";
import { DeductStockCommand } from "../dto/deduct-stock.command";
import { ProductSalesStatResult } from "../dto/product-sales-stat.result";
import { ProductRepository } from "../product.repository";
import { ProductSalesStatRepository } from "../product_sales_stat.repository";
import { Product } from "@prisma/client";

@Injectable()
export class ProductService {
  constructor(
    protected readonly productRepository: ProductRepository,
    protected readonly productSalesStatRepository: ProductSalesStatRepository
  ) {}

  async getAllProducts(): Promise<ProductResult[]> {
    return await this.productRepository.findAll();
  }

  async getProduct(command: GetProductCommand): Promise<ProductResult> {
    const productId = command.productId;

    const result: Product = await this.productRepository.findById(productId);
    if(result === null) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    return result;
  }

  async addStock(command: AddStockCommand): Promise<ProductResult> {
    const productId = command.productId;
    const amount = command.amount;

    const product: Product = await this.productRepository.findById(productId);
    if(product === null) {
      throw new Error("PRODUCT_NOT_FOUND");
    }
    if(product.stock + amount > 2_147_483_647) {
      throw new Error("OVER_STOCK_LIMIT");
    }

    const result: Product = await this.productRepository.updateStock(productId, product.stock + amount);

    return result;
  }

  async deductStock(command: DeductStockCommand): Promise<ProductResult> {
    const productId = command.productId;
    const amount = command.amount;

    const product: Product = await this.productRepository.findById(productId);
    if(product === null) {
      throw new Error("PRODUCT_NOT_FOUND");
    }
    if(product.stock < amount) {
      throw new Error("NOT_ENOUGH_STOCK");
    }

    const result: Product = await this.productRepository.updateStock(productId, product.stock - amount);

    return result;
  }

  async getPopularProducts(): Promise<ProductSalesStatResult[]> {
    const popularProducts = [
      { rank: 1, productId: 2, productName: "애플 맥세이프 충전기 20W", amount: 700, sales: 55300000 },
      { rank: 2, productId: 5, productName: "미니 향균 티슈 250매", amount: 342, sales: 855000 },
      { rank: 3, productId: 7, productName: "모나미 볼펜 12자루", amount: 321, sales: 321000 },
      { rank: 4, productId: 1, productName: "다이슨 에어랩", amount: 50, sales: 60500000 },
      { rank: 5, productId: 3, productName: "무지 라운드넥 반팔티 Free(W/M)", amount: 1, sales: 24900 },
    ];

    return popularProducts;
  }
}
