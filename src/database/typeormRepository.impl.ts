import { Repository } from "typeorm";
import { IRepository } from "./repository.interface";

export class TypeORMRepositoryImpl<T, ID = number> implements IRepository<T, ID> {
  private readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: ID): Promise<T | null> {
    const entity = await this.repository.findOne({ where: { id } as any });
    return entity || null;
  }

  async create(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async updateById(id: ID, entity: Partial<T>): Promise<T> {
    await this.repository.update(id as any, entity as any);
    const updatedEntity = await this.findById(id);
    if (!updatedEntity) {
      throw new Error(`Entity with ID ${id} not found`);
    }
    return updatedEntity;
  }

  async deleteById(id: ID): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error(`Entity with ID ${id} not found`);
    }
    await this.repository.delete(id as any);
    return entity;
  }

  async find(options: {
    where?: Partial<T>;
    select?: Partial<Record<keyof T, boolean>>;
    orderBy?: { [K in keyof T]?: "asc" | "desc" } | Array<{ [K in keyof T]?: "asc" | "desc" }>;
  }): Promise<T[]> {
    const queryOptions: any = {};

    if (options.where) {
      queryOptions.where = options.where;
    }

    if (options.select) {
      queryOptions.select = options.select;
    }

    if (options.orderBy) {
      queryOptions.order = options.orderBy;
    }

    return this.repository.find(queryOptions);
  }
}
