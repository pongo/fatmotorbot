import { assert } from 'chai';
import { sql } from 'slonik';
import { InfoRepository, UserInfo } from 'src/app/bot/InfoCommand/InfoRepository';
import { cm } from 'src/app/shared/types';
import { parseConfig } from 'src/config';
import { createDB } from 'src/shared/infrastructure/createDB';
import { Result } from 'src/shared/utils/result';
import { u } from 'test/utils';

const config = (parseConfig() as unknown) as { DATABASE_URL_TEST: string };
const db = createDB(config.DATABASE_URL_TEST);

describe('InfoRepository', () => {
  before(async () => {
    await db.connect(async connection => {
      return connection.query(sql`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = 'users'
          AND state = 'idle in transaction';

        DROP TABLE IF EXISTS users;
        CREATE TEMP TABLE IF NOT EXISTS users
        (
            user_id integer NOT NULL
                CONSTRAINT users_pk
                    PRIMARY KEY,
            gender  varchar(255),
            height  numeric(20, 2)
        );
      `);
    });
  });

  it('get() should return null on empty db', async () => {
    const repository = new InfoRepository(db);
    const actual = await repository.get(u(1));
    assert.deepEqual(actual, Result.ok(null));
  });

  it('set() should save data', async () => {
    const repository = new InfoRepository(db);
    const data: UserInfo = { height: cm(180), gender: 'male' };
    const data2: UserInfo = { height: cm(180), gender: 'male' };

    const addResult = await repository.set(u(1), data);
    const actual = await repository.get(u(1));

    assert.isTrue(addResult.isOk);
    assert.deepEqual(actual, Result.ok(data));

    await repository.set(u(1), data2);
    const actual2 = await repository.get(u(1));
    assert.deepEqual(actual2, Result.ok(data2));
  });
});
