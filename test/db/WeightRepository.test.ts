import { assert } from 'chai';
import { sql } from 'slonik';
import { WeightRepository } from 'src/app/core/repositories/WeightRepository';
import { kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { alwaysThrowDB, createTestDB, WeightDbApi } from 'test/db/createTestDB';
import { m, sortMeasuresFromNewestToOldest, u } from 'test/utils';

const db = createTestDB();
const dbApi = new WeightDbApi(db);

describe('WeightRepository', () => {
  before(async () => dbApi.createTable());
  after(async () => dbApi.dropTable());

  describe('empty db', () => {
    beforeEach(async () => dbApi.truncateTable());

    it('getAll() should return []', async () => {
      const repository = new WeightRepository(db);
      const actual = await repository.getAll(u(1));
      assert.deepStrictEqual(actual, Result.ok([]));
    });

    it('add() should add measures', async () => {
      const date = new Date('2019-08-28 17:00');
      const repository = new WeightRepository(db);

      const addResult = await repository.add(u(1), kg(100), date);
      const actual = await repository.getAll(u(1));

      assert.isTrue(addResult.isOk);
      assert.deepStrictEqual(actual, Result.ok([m(date, kg(100))]));
    });

    it('getCurrent() should return null', async () => {
      const repository = new WeightRepository(db);
      const actual = await repository.getCurrent(u(1));
      assert.deepStrictEqual(actual, Result.ok(null));
    });
  });

  describe('db with measures', () => {
    beforeEach(async () => {
      await db.connect(async (connection) => {
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

    it('getAll() should return ordered measures', async () => {
      const repository = new WeightRepository(db);

      const actual = await repository.getAll(u(1));

      assert(actual.isOk);
      assert.sameDeepOrderedMembers(
        actual.value,
        sortMeasuresFromNewestToOldest([
          m(new Date('2019-08-28 16:58:24.918000'), kg(90)),
          m(new Date('2019-08-27 16:58:20.482000'), kg(50)),
          m(new Date('2019-07-28 16:58:24.918000'), kg(100)),
        ])
      );
    });

    it('getCurrent() should return current weight as Kg', async () => {
      const repository = new WeightRepository(db);
      const actual = await repository.getCurrent(u(1));
      assert.deepStrictEqual(actual, Result.ok(kg(90)));
    });
  });

  it('should catch errors', async () => {
    const repository = new WeightRepository(alwaysThrowDB);

    assert.ok((await repository.add(u(1), kg(100), new Date())).isErr);
    assert.ok((await repository.getAll(u(1))).isErr);
    assert.ok((await repository.getCurrent(u(1))).isErr);
  });
});
