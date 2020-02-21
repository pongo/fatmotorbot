/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* tslint:disable:no-non-null-assertion */
import { parse as parseConnectionString } from 'pg-connection-string';
import { migrate } from 'postgres-migrations';
import { parseConfig } from './config';

async function main() {
  const config = parseConfig();
  const dbConfig = parseConnectionString(config.DATABASE_URL);

  await migrate(
    {
      database: dbConfig.database!,
      user: dbConfig.user!,
      password: dbConfig.password!,
      host: dbConfig.host!,
      port: parseInt(dbConfig.port!, 10),
    },
    'migrations',
    { logger: console.log },
  );
}

main(); // tslint:disable-line:no-floating-promises
