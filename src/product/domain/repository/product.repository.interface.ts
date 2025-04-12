import { IRepository } from "@app/database/repository.interface";
import { Product } from "@prisma/client";

export interface IProductRepository extends IRepository<Product> {
  updateStock(id: number, stock: number): Promise<Product>;
}

export const IPRODUCT_REPOSITORY = Symbol("IPRODUCT_REPOSITORY");
