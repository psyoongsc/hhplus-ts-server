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
  execSync(`npx prisma db push --force-reset --skip-generate`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
    },
  });

  // Save container for teardown
  globalThis.__DB_CONTAINER__ = container;
};
