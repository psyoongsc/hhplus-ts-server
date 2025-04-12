import { IRepository } from "@app/database/repository.interface";
import { Product_Sales_Stat } from "@prisma/client";

export interface IProductSalesStatRepository extends IRepository<Product_Sales_Stat> {
  getTop5ProductByAmountLast3Days(): Promise<
    { rank: number; productId: number; productName: string; amount: number; sales: number }[]
  >;
}

export const IPRODUCT_SALES_STAT_REPOSITORY = Symbol("IPRODUCT_SALES_STAT_REPOSITORY");
