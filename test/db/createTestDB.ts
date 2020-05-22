import { DatabasePoolType, sql } from 'slonik';
import { parseConfig } from 'src/config';
import { createDB } from 'src/shared/infrastructure/createDB';

export function createTestDB() {
  const config = (parseConfig() as unknown) as { DATABASE_URL_TEST: string };
  return createDB(config.DATABASE_URL_TEST);
}

export class InfoDbApi {
  constructor(private readonly db: DatabasePoolType) {}

  async createTable() {
    await this.db.connect(async (connection) => {
      return connection.query(sql`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = 'users'
          AND state = 'idle in transaction';

        DROP TABLE IF EXISTS users;
        CREATE UNLOGGED TABLE IF NOT EXISTS users
        (
            user_id integer NOT NULL
                CONSTRAINT users_pk
                    PRIMARY KEY,
            gender  varchar(255),
            height  numeric(20, 2)
        );
      `);
    });
  }

  async dropTable() {
    await this.db.connect(async (connection) => {
      return connection.query(sql`
        DROP TABLE IF EXISTS users;
      `);
    });
  }

  async truncateTable() {
    await this.db.connect(async (connection) => connection.query(sql`TRUNCATE TABLE users;`));
  }
}

export class WeightDbApi {
  constructor(private readonly db: DatabasePoolType) {}

  async createTable() {
    await this.db.connect(async (connection) => {
      return connection.query(sql`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = 'measures'
          AND state = 'idle in transaction';

        DROP TABLE IF EXISTS measures;
        CREATE UNLOGGED TABLE IF NOT EXISTS measures
        (
            measure_id serial PRIMARY KEY,
            user_id    integer        NOT NULL,
            value_type varchar(255)   NOT NULL,
            value      decimal(20, 2) NOT NULL, --- 20 is big enough
            date       timestamptz DEFAULT CURRENT_TIMESTAMP
        );
      `);
    });
  }

  async dropTable() {
    await this.db.connect(async (connection) => {
      return connection.query(sql`
        DROP TABLE IF EXISTS measures;
      `);
    });
  }

  async truncateTable() {
    await this.db.connect(async (connection) => connection.query(sql`TRUNCATE TABLE measures;`));
  }
}
