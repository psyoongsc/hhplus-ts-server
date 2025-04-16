import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const runMode = process.env.RUN_MODE;
    const databaseUrl =
      runMode === 'test'
        ? process.env.TEST_DATABASE_URL
        : process.env.DATABASE_URL;

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
