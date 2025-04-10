import { Inject, Injectable } from "@nestjs/common";
import { ProductSalesStatResult } from "../dto/product-sales-stat.result";
import { AddProductSalesStatResult } from "../dto/add-product-sales-stat.result";
import { Product_Sales_Stat } from "@prisma/client";
import { ProductSalesStatRepository } from "../infrastructure/product_sales_stat.repository";
import { AddProductSalesStatCommand, PaidProduct } from "../dto/add-product-sales-stat.command";
import { IPRODUCT_SALES_STAT_REPOSITORY } from "../product_sales_stat.interface.repository";

@Injectable()
export class ProductSalesStatService {
  constructor(
    @Inject(IPRODUCT_SALES_STAT_REPOSITORY)
    protected readonly productSalesStatRepository: ProductSalesStatRepository,
  ) {}

  async getPopularProducts(): Promise<ProductSalesStatResult[]> {
    return await this.productSalesStatRepository.getTop5ProductByAmountLast3Days();
  }

  async addProductSalesStat(command: AddProductSalesStatCommand): Promise<AddProductSalesStatResult> {
    const salesDate: Date = command.salesDate;
    const paidProducts: PaidProduct[] = command.paidProducts;

    let total_paidSales = 0;
    for (const paidProduct of paidProducts) {
      const productStat: Partial<Product_Sales_Stat>[] = await this.productSalesStatRepository.find({
        where: { salesDate, productId: paidProduct.productId },
        select: { total_amount: true, total_sales: true },
      });
      if (productStat.length == 0) {
        await this.productSalesStatRepository.create({ salesDate, ...paidProduct });
      } else {
        const paidProductAmount = paidProduct.total_amount;
        const paidProductSales = paidProduct.total_sales;
        await this.productSalesStatRepository.updateById(paidProduct.productId, {
          total_amount: productStat[0].total_amount + paidProductAmount,
          total_sales: productStat[0].total_sales + paidProductSales,
        });
      }

      total_paidSales += paidProduct.total_sales;
    }

    return { total_sales: total_paidSales };
  }
}
