import { assert } from 'chai';
import { sql } from 'slonik';
import { WeightRepository } from 'src/app/core/Weight/WeightRepository';
import { kg } from 'src/app/shared/types';
import { parseConfig } from 'src/config';
import { createDB } from 'src/shared/infrastructure/createDB';
import { Result } from 'src/shared/utils/result';
import { m, sortMeasuresFromNewestToOldest, u } from 'test/utils';

const config = (parseConfig() as unknown) as { DATABASE_URL_TEST: string };
const db = createDB(config.DATABASE_URL_TEST);

describe('WeightRepository', () => {
  before(async () => {
    await db.connect(async connection => {
      return connection.query(sql`
        SELECT pg_terminate_backend(pid)
        FROM pg_stat_activity
        WHERE datname = 'measures'
          AND state = 'idle in transaction';

        DROP TABLE IF EXISTS measures;
        CREATE TEMP TABLE IF NOT EXISTS measures
        (
            measure_id serial PRIMARY KEY,
            user_id    integer        NOT NULL,
            value_type varchar(255)   NOT NULL,
            value      decimal(20, 2) NOT NULL, --- 20 is big enough
            date       timestamptz DEFAULT CURRENT_TIMESTAMP
        );
      `);
    });
  });

  describe('on empty db', () => {
    beforeEach(async () => {
      await db.connect(async connection => connection.query(sql`TRUNCATE TABLE measures;`));
    });

    it('getAll() should returns []', async () => {
      const repository = new WeightRepository(db);
      const actual = await repository.getAll(u(1));
      assert.deepEqual(actual, Result.ok([]));
    });

    it('add() should add measures', async () => {
      const date = new Date('2019-08-28 17:00');
      const repository = new WeightRepository(db);

      const addResult = await repository.add(u(1), kg(100), date);
      const actual = await repository.getAll(u(1));

      assert.isTrue(addResult.isOk);
      assert.deepEqual(actual, Result.ok([m(date, kg(100))]));
    });

    it('getCurrent() should return null', async () => {
      const repository = new WeightRepository(db);
      const actual = await repository.getCurrent(u(1));
      assert.deepEqual(actual, Result.ok(null));
    });
  });

  describe('on db with measures', () => {
    beforeEach(async () => {
      await db.connect(async connection => {
        return connection.query(sql`
          TRUNCATE TABLE measures;
          INSERT INTO measures (measure_id, user_id, value_type, value, date)
          VALUES (1, 1, 'weight', 100.00, '2019-07-28 16:58:24.918000'),
                 (2, 1, 'weight', 90.00, '2019-08-28 16:58:24.918000'),
                 (3, 1, 'weight', 50.00, '2019-08-27 16:58:20.482000'),
                 (4, 1, 'mmmm', 50.00, '2019-06-28 16:58:24.918000');
        `);
      });
    });

    it('getAll() should returns ordered measures', async () => {
      const repository = new WeightRepository(db);

      const actual = await repository.getAll(u(1));

      if (actual.isErr) throw Error('should be ok');
      assert.sameDeepOrderedMembers(
        actual.value,
        sortMeasuresFromNewestToOldest([
          m(new Date('2019-08-28 16:58:24.918000'), kg(90)),
          m(new Date('2019-08-27 16:58:20.482000'), kg(50)),
          m(new Date('2019-07-28 16:58:24.918000'), kg(100)),
        ]),
      );
    });

    it('getCurrent() should return current weight as Kg', async () => {
      const repository = new WeightRepository(db);
      const actual = await repository.getCurrent(u(1));
      assert.deepEqual(actual, Result.ok(kg(90)));
    });
  });
});
