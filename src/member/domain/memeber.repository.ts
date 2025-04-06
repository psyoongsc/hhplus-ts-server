import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Member } from "./entity/member.entity";
import { PrismaClient } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MemberRepository extends PrismaRepository<Member> {
  constructor(prisma: PrismaClient) {
    super(prisma, prisma.user);
  }
}