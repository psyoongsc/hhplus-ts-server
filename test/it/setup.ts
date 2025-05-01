import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

let mysql_container: StartedMySqlContainer;
let redis_container: StartedRedisContainer;

export default async () => {
  mysql_container = await new MySqlContainer('mysql:8')
    .withUsername('test')
    .withRootPassword('test')
    .withDatabase('testdb')
    .withCopyFilesToContainer([
      {
        source: path.resolve(__dirname, './import.sql'),
        target: '/docker-entrypoint-initdb.d/init.sql'
      }
    ])
    .start();

  const databaseUrl = `mysql://test:test@${mysql_container.getHost()}:${mysql_container.getMappedPort(3306)}/testdb`;

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

  // redis container
  redis_container = await new RedisContainer().start();
  const redisHost = redis_container.getHost();
  const redisPort = redis_container.getMappedPort(6379);

  process.env.REDIS_CLUSTER_MODE = 'false';
  process.env.REDIS_HOST = redisHost;
  process.env.REDIS_PORT = redisPort.toString();


  // Save container for teardown
  globalThis.__DB_CONTAINER__ = mysql_container;
  globalThis.__REDIS_CONTAINER__ = redis_container;
};
