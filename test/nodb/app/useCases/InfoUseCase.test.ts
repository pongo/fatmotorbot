/* eslint-disable @typescript-eslint/unbound-method */
import { assert } from 'chai';
import sinon, { SinonSpy } from 'sinon';
import { UserInfo } from 'src/app/core/Info/InfoRepository';
import { InfoSetResult, InfoUseCase, validateData } from 'src/app/core/Info/InfoUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { cm, Kg, kg, MeasuresFromNewestToOldest } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { InfoRepositoryMock, InfoRepositoryMockSinon, WeightRepositoryMock } from 'test/repositoryMocks';
import { u } from 'test/utils';

describe('InfoUseCase', () => {
  describe('get()', () => {
    it('should return null if no data', async () => {
      const infoRepo = new InfoRepositoryMock({ get: Result.ok(null) });
      const weightRepo = new WeightRepositoryMock();
      const usecase = new InfoUseCase(infoRepo, weightRepo);

      const actual = await usecase.get(u(1));

      assert.deepEqual(actual, Result.ok({ case: 'get:no-user-info' as const }));
    });

    it('should return user data', async () => {
      const data: UserInfo = { gender: 'male', height: cm(171) };
      const infoRepo = new InfoRepositoryMock({ get: Result.ok(data) });
      const weightRepo = new WeightRepositoryMock();
      const usecase = new InfoUseCase(infoRepo, weightRepo);

      const actual = await usecase.get(u(1));

      assert.deepEqual(actual, Result.ok({ case: 'get' as const, data }));
    });
  });

  describe('set()', () => {
    it('should return error on invalid format', async () => {
      const infoRepo = new InfoRepositoryMock();
      const weightRepo = new WeightRepositoryMock({ getCurrent: Result.ok(null) });
      const usecase = new InfoUseCase(infoRepo, weightRepo);

      const actual = await usecase.set(u(1), []);

      assert.deepEqual(actual, Result.err(new InvalidFormatError()));
    });

    it('should add valid data to empty db', async () => {
      const data: UserInfo = { gender: 'female', height: cm(150) };
      const infoRepo = InfoRepositoryMockSinon({ set: Result.ok() });
      const weightRepo = new WeightRepositoryMock({
        getCurrent: Result.ok(null),
        getAll: Result.ok([]),
      });
      const usecase = new InfoUseCase(infoRepo, weightRepo);

      const actual = await usecase.set(u(1), ['ж', '150']);

      sinon.assert.calledOnce(infoRepo.set as SinonSpy);
      sinon.assert.calledWith(infoRepo.set as SinonSpy, u(1), data);
      assert.deepEqual<Result<InfoSetResult>>(actual, Result.ok({ case: 'set' as const, data, bmi: null }));
    });

    it('should add valid data to db with weight', async () => {
      const data: UserInfo = { gender: 'female', height: cm(150) };
      const infoRepo = new InfoRepositoryMock({ set: Result.ok(), get: Result.ok(data) });
      const weightRepo = new WeightRepositoryMock({
        getCurrent: Result.ok(kg(100)),
        getAll: Result.ok<MeasuresFromNewestToOldest<Kg>>([{ date: new Date(), value: kg(100) }]),
      });
      const usecase = new InfoUseCase(infoRepo, weightRepo);

      const actual = await usecase.set(u(1), ['ж', '150']);

      assert.deepEqual(infoRepo.calls.get('set'), [[u(1), data]]);
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
