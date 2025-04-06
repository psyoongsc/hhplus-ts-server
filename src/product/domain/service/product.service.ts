import { Injectable } from "@nestjs/common";
import { ProductResult } from "../dto/product.result";
import { GetProductCommand } from "../dto/get-product.command";
import { AddStockCommand } from "../dto/add-stock.command";
import { DeductStockCommand } from "../dto/deduct-stock.command";
import { ProductSalesStatResult } from "../dto/product-sales-stat.result";

@Injectable()
export class ProductService {
  async getAllProducts(): Promise<ProductResult[]> {
    const products = [
      { id: 1, name: "다이슨 에어랩", stock: 121, price: 1200000 },
      { id: 2, name: "애플 맥세이프 충전기 20W", stock: 1, price: 79000 },
      { id: 3, name: "무지 라운드넥 반팔티 Free(W/M)", stock: 1500, price: 24900 },
      { id: 4, name: "안경닦이 100x100", stock: 0, price: 500 },
      { id: 5, name: "미니 향균 티슈 250매", stock: 37, price: 2500 },
      { id: 6, name: "아디다스 삼선 슬리퍼 275mm", stock: 15, price: 65000 },
      { id: 7, name: "모나미 볼펜 12자루", stock: 1000, price: 5900 },
    ];

    return products;
  }

  async getProduct(command: GetProductCommand): Promise<ProductResult> {
    const productId = command.productId;

    return { id: 1, name: "다이슨 에어랩", stock: 121, price: 1200000 };
  }

  async addStock(command: AddStockCommand): Promise<ProductResult> {
    const productId = command.productId;
    const amount = command.amount;

    return { id: 1, name: "다이슨 에어랩", stock: 121 + amount, price: 79000 };
  }

  async deductStock(command: DeductStockCommand): Promise<ProductResult> {
    const productId = command.productId;
    const amount = command.amount;

    return { id: 1, name: "다이슨 에어랩", stock: 121 - amount, price: 79000 };
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
