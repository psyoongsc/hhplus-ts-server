import { IRepository } from "@app/database/repository.interface";
import { Member } from "./entity/member.entity";

export interface IMemberRepository extends IRepository<Member> {
  updateBalance(id: number, balance: number): Promise<Member>;
}

export const IMEMBER_REPOSITORY = Symbol("IMEMBER_REPOSITORY");
