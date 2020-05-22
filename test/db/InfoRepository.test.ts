import { assert } from 'chai';
import { InfoRepository, UserInfo } from 'src/app/core/repositories/InfoRepository';
import { cm } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { alwaysThrowDB, createTestDB, InfoDbApi } from 'test/db/createTestDB';
import { u } from 'test/utils';

const db = createTestDB();
const dbApi = new InfoDbApi(db);

describe('InfoRepository', () => {
  before(async () => dbApi.createTable());
  after(async () => dbApi.dropTable());

  it('get() should return null on empty db', async () => {
    const repository = new InfoRepository(db);
    const actual = await repository.get(u(1));
    assert.deepStrictEqual(actual, Result.ok(null));
  });

  it('set() should save data', async () => {
    const repository = new InfoRepository(db);
    const data: UserInfo = { height: cm(180), gender: 'male' };
    const data2: UserInfo = { height: cm(180), gender: 'male' };

    const addResult = await repository.set(u(1), data);
    const actual = await repository.get(u(1));

    assert.isTrue(addResult.isOk);
    assert.deepStrictEqual(actual, Result.ok(data));

    await repository.set(u(1), data2);
    const actual2 = await repository.get(u(1));
    assert.deepStrictEqual(actual2, Result.ok(data2));
  });

  it('should catch errors', async () => {
    const repository = new InfoRepository(alwaysThrowDB);

    assert.ok((await repository.get(u(1))).isErr);
    assert.ok((await repository.set(u(1), { height: cm(180), gender: 'male' })).isErr);
  });
});
