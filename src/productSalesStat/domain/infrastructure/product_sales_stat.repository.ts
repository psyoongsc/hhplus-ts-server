import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Product_Sales_Stat } from "../entity/product_sales_stat.entity";
import { PrismaService } from "@app/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { IProductSalesStatRepository } from "../product_sales_stat.interface.repository";

@Injectable()
export class ProductSalesStatRepository
  extends PrismaRepository<Product_Sales_Stat>
  implements IProductSalesStatRepository
{
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.product_Sales_Stat);
  }

  async getTop5ProductByAmountLast3Days(): Promise<
    { rank: number; productId: number; productName: string; amount: number; sales: number }[]
  > {
    return await this.prisma.$queryRaw<
      { rank: number; productId: number; productName: string; amount: number; sales: number }[]
    >`
      SELECT 
        RANK() OVER (ORDER BY amount DESC) AS \`rank\`,
        productId,
        productName,
        amount,
        sales
      FROM (
        SELECT 
          productId,
          productName,
          SUM(total_amount) AS amount,
          SUM(total_sales) AS sales
        FROM Product_Sales_Stat
        WHERE salesDate >= CURDATE() - INTERVAL 3 DAY
          AND salesDate < CURDATE()
        GROUP BY productId, productName
      ) AS ranked
      ORDER BY amount DESC
      LIMIT 5;
    `;
  }
}
