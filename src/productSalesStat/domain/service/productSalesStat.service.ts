import { Inject, Injectable } from "@nestjs/common";
import { ProductSalesStatResult } from "../dto/product-sales-stat.result.dto";
import { AddProductSalesStatResult } from "../dto/add-product-sales-stat.result.dto";
import { Prisma, Product_Sales_Stat } from "@prisma/client";
import { ProductSalesStatRepository } from "../../infrastructure/product_sales_stat.repository";
import { AddProductSalesStatCommand, PaidProduct } from "../dto/add-product-sales-stat.command.dto";
import { IPRODUCT_SALES_STAT_REPOSITORY } from "../repository/product_sales_stat.interface.repository";
import { TransactionService } from "@app/database/prisma/transaction.service";
import { IPRODUCT_SALES_STAT_VIEW_REPOSITORY } from "../repository/product_sales_stat_view.interface.repository";
import { ProductSalesStatViewRepository } from "@app/productSalesStat/infrastructure/product_sales_stat_view.repository";

@Injectable()
export class ProductSalesStatService {
  constructor(
    @Inject(IPRODUCT_SALES_STAT_REPOSITORY)
    protected readonly productSalesStatRepository: ProductSalesStatRepository,
    // @Inject(IPRODUCT_SALES_STAT_VIEW_REPOSITORY)
    // protected readonly productSalesStatViewRepository: ProductSalesStatViewRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async getPopularProducts(txc?: Prisma.TransactionClient): Promise<ProductSalesStatResult[]> {
    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      const result = await this.productSalesStatRepository.getTop5ProductByAmountLast3Days(client);
      const formatted = result.map(r => ({ ...r, rank: Number(r.rank), amount: Number(r.amount), sales: Number(r.sales) }));

      return formatted;
    });
  }

  // async getPopularProductsV2(txc?: Prisma.TransactionClient): Promise<ProductSalesStatResult[]> {
  //   return await this.transactionService.executeInTransaction(async (tx) => {
  //     const client = txc ?? tx;

  //     return await this.productSalesStatViewRepository.getTop5ProductByAmountLast3Days(client);
  //   });
  // }

  async addProductSalesStat(command: AddProductSalesStatCommand, txc?: Prisma.TransactionClient): Promise<AddProductSalesStatResult> {
    const salesDate: Date = command.salesDate;
    const paidProducts: PaidProduct[] = command.paidProducts;

    return await this.transactionService.executeInTransaction(async (tx) => {
      const client = txc ?? tx;

      let total_paidSales = 0;
      for (const paidProduct of paidProducts) {
        const productStat: Partial<Product_Sales_Stat>[] = await this.productSalesStatRepository.find({
          where: { salesDate, productId: paidProduct.productId },
          select: { total_amount: true, total_sales: true },
        }, client);
        if (productStat.length == 0) {
          await this.productSalesStatRepository.create({ salesDate, ...paidProduct }, client);
        } else {
          const paidProductAmount = paidProduct.total_amount;
          const paidProductSales = paidProduct.total_sales;
          await this.productSalesStatRepository.updateById(paidProduct.productId, {
            total_amount: productStat[0].total_amount + paidProductAmount,
            total_sales: productStat[0].total_sales + paidProductSales,
          }, client);
        }
  
        total_paidSales += paidProduct.total_sales;
      }
  
      return { total_sales: total_paidSales };
    });
  }
}
