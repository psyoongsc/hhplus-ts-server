import { IRepository } from "@app/database/repository.interface";
import { Member, Prisma } from "@prisma/client";

export interface IMemberRepository extends IRepository<Member> {
  updateBalance(id: number, balance: number, tx?: Prisma.TransactionClient): Promise<Member>;
}

export const IMEMBER_REPOSITORY = Symbol("IMEMBER_REPOSITORY");
