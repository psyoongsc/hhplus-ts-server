import { PrismaClient } from "@prisma/client";
import { IRepository } from "./repository.interface";

export class PrismaRepository<T, ID = number> implements IRepository<T, ID> {
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly model: any,
  ) {}

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async findById(id: ID): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async create(entity: T): Promise<T> {
    return this.model.create({
      data: entity,
    });
  }

  async updateById(id: ID, entity: Partial<T>): Promise<T> {
    return this.model.update({
      where: { id },
      data: entity,
    });
  }

  async deleteById(id: ID): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async find(options: {
    where?: Partial<T>;
    select?: Partial<Record<keyof T, boolean>>;
    orderBy?: { [K in keyof T]?: "asc" | "desc" } | Array<{ [K in keyof T]?: "asc" | "desc" }>;
  }): Promise<T[]> {
    return this.model.findMany({
      where: options.where,
      select: options.select,
      orderBy: options.orderBy,
    });
  }

  async upsert(options: { where: Partial<T>; create: T; update: Partial<T> }): Promise<T> {
    return this.model.upsert({
      where: options.where,
      create: options.create,
      update: options.update,
    });
  }
}
