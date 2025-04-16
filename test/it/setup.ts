import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

let container: StartedMySqlContainer;

export default async () => {
  container = await new MySqlContainer('mysql:8')
    .withUsername('test')
    .withRootPassword('test')
    .withDatabase('testdb')
    .start();

  const databaseUrl = `mysql://test:test@${container.getHost()}:${container.getMappedPort(3306)}/testdb`;

  process.env.TEST_DATABASE_URL = databaseUrl;

  console.log('📦 MySQL TestContainer started:', databaseUrl);

  // Run Prisma migrations
  execSync(`npx prisma migrate deploy`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
  });

  // Seed data from SQL file (if present)
  const seedPath = path.join(__dirname, 'import.sql');

  if (fs.existsSync(seedPath)) {
    const sql = fs.readFileSync(seedPath, 'utf8');
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(Boolean);

    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        }
      }
    });

    try {
      for (const statement of statements) {
        await prisma.$executeRawUnsafe(statement);
      }
      console.log('🌱 Seed data executed successfully.');
    } catch (err) {
      console.error('❌ Error executing seed SQL:', err);
      throw err;
    } finally {
      await prisma.$disconnect();
    }
  }

  // Save container for teardown
  globalThis.__DB_CONTAINER__ = container;
};
