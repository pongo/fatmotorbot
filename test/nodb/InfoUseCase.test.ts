import { assert } from 'chai';
import sinon from 'sinon';
import { IInfoRepository, UserInfo } from 'src/app/bot/InfoCommand/InfoRepository';
import { InfoSetResult, InfoUseCase, validateData } from 'src/app/bot/InfoCommand/InfoUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { cm, kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { u } from 'test/utils';

describe('InfoUseCase', () => {
  describe('get()', () => {
    it('should return null if no data', async () => {
      const repo: IInfoRepository = { set: sinon.fake.throws(''), get: async () => Result.ok(null) };
      const weightRepo = { getCurrent: sinon.fake.throws('') };
      const usecase = new InfoUseCase(repo, weightRepo);

      const actual = await usecase.get(u(1));

      assert.deepEqual(actual, Result.ok({ case: 'get:none' as const }));
    });

    it('should return user data', async () => {
      const data: UserInfo = { gender: 'male', height: cm(171) };
      const repo: IInfoRepository = {
        set: sinon.fake.throws(''),
        get: async () => Result.ok(data),
      };
      const weightRepo = { getCurrent: sinon.fake.throws('') };
      const usecase = new InfoUseCase(repo, weightRepo);

      const actual = await usecase.get(u(1));

      assert.deepEqual(actual, Result.ok({ case: 'get' as const, data }));
    });
  });

  describe('set()', () => {
    it('should return error on invalid format', async () => {
      const repo = { set: sinon.fake.throws(''), get: sinon.fake.throws('') };
      const weightRepo = { getCurrent: sinon.fake.returns(Result.ok(null)) };
      const usecase = new InfoUseCase(repo, weightRepo);

      const actual = await usecase.set(u(1), []);

      assert.deepEqual(actual, Result.err(new InvalidFormatError()));
    });

    it('should add valid data to empty db', async () => {
      const data: UserInfo = { gender: 'female', height: cm(150) };
      const repo = { set: sinon.fake.returns(Result.ok()), get: sinon.fake.throws('') };
      const weightEmptyRepo = { getCurrent: sinon.fake.returns(Result.ok(null)) };
      const usecase = new InfoUseCase(repo, weightEmptyRepo);

      const actual = await usecase.set(u(1), ['ж', '150']);

      sinon.assert.calledOnce(repo.set);
      sinon.assert.calledWith(repo.set, u(1), data);
      assert.deepEqual<Result<InfoSetResult>>(actual, Result.ok({ case: 'set' as const, data, bmi: null }));
    });

    it('should add valid data to db with weight', async () => {
      const data: UserInfo = { gender: 'female', height: cm(150) };
      const repo = { set: sinon.fake.returns(Result.ok()), get: sinon.fake.throws('') };
      const weightRepo = { getCurrent: sinon.fake.returns(Result.ok(kg(100))) };
      const usecase = new InfoUseCase(repo, weightRepo);

      const actual = await usecase.set(u(1), ['ж', '150']);

      sinon.assert.calledOnce(repo.set);
      sinon.assert.calledWith(repo.set, u(1), data);
      if (actual.isErr) throw new Error('actual2 should be ok');
      assert.isNotNull(actual.value.bmi);
      assert.equal(actual.value.bmi!.case, 'bmi');
    });
  });
});

describe('validateData()', () => {
  it('empty args', () => {
    assert.isNull(validateData([]));
  });

  it('wrong args length', () => {
    assert.isNull(validateData(['1']));
  });

  it('wrong gender', () => {
    assert.isNull(validateData(['тю', '12']));
  });

  it('wrong height', () => {
    assert.isNull(validateData(['м', 'рост']));
    assert.isNull(validateData(['м', '-100']));
    assert.isNull(validateData(['м', '0']));
    assert.isNull(validateData(['м', '99']));
    assert.isNull(validateData(['м', '301']));
  });

  it('valid data', () => {
    assert.deepEqual(validateData(['ж', '100', 'см']), { gender: 'female', height: cm(100) });
    assert.deepEqual(validateData(['м', '300', 'см']), { gender: 'male', height: cm(300) });
  });
});
