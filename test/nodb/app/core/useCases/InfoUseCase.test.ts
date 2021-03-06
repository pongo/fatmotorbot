import { assert } from 'chai';
import sinon, { SinonSpy } from 'sinon';
import { SlonikError } from 'slonik';
import { UserInfo } from 'src/app/core/repositories/InfoRepository';
import { InfoUseCase, validateData } from 'src/app/core/useCases/Info/InfoUseCase';
import { InfoSetResult } from 'src/app/core/useCases/Info/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { cm, Kg, kg, MeasuresFromNewestToOldest } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { InfoRepositoryMock, InfoRepositoryMockSinon, WeightRepositoryMock } from 'test/repositoryMocks';
import { u } from 'test/utils';

describe('InfoUseCase', () => {
  describe('get()', () => {
    it('should return error on database error', async () => {
      const infoRepo = new InfoRepositoryMock({ get: Result.err(new DatabaseError(new SlonikError())) });
      const weightRepo = new WeightRepositoryMock();
      const usecase = new InfoUseCase(infoRepo, weightRepo);

      assert.isTrue((await usecase.get(u(1))).isErr);
    });

    it('should return null if no data', async () => {
      const infoRepo = new InfoRepositoryMock({ get: Result.ok(null) });
      const weightRepo = new WeightRepositoryMock();
      const usecase = new InfoUseCase(infoRepo, weightRepo);

      const actual = await usecase.get(u(1));

      assert.deepStrictEqual(actual, Result.ok({ case: 'get:no-user-info' as const }));
    });

    it('should return user data', async () => {
      const data: UserInfo = { gender: 'male', height: cm(171) };
      const infoRepo = new InfoRepositoryMock({ get: Result.ok(data) });
      const weightRepo = new WeightRepositoryMock();
      const usecase = new InfoUseCase(infoRepo, weightRepo);

      const actual = await usecase.get(u(1));

      assert.deepStrictEqual(actual, Result.ok({ case: 'get' as const, data }));
    });
  });

  describe('set()', () => {
    it('should return error on invalid format', async () => {
      const infoRepo = new InfoRepositoryMock();
      const weightRepo = new WeightRepositoryMock({ getCurrent: Result.ok(null) });
      const usecase = new InfoUseCase(infoRepo, weightRepo);

      const actual = await usecase.set(u(1), []);

      assert.deepStrictEqual(actual, Result.err(new InvalidFormatError()));
    });

    it('should return error on database error', async () => {
      const err = Result.err(new DatabaseError(new SlonikError()));
      const infoRepo = new InfoRepositoryMock({ set: err });
      const weightRepo = new WeightRepositoryMock();
      const usecase = new InfoUseCase(infoRepo, weightRepo);

      assert.isTrue((await usecase.set(u(1), ['ж', '150'])).isErr);
    });

    it('should skip bmi on bmi error', async () => {
      const err = Result.err(new DatabaseError(new SlonikError()));
      const infoRepo = InfoRepositoryMockSinon({ set: Result.ok() });
      const weightRepo = new WeightRepositoryMock({ getCurrent: err, getAll: err });
      const usecase = new InfoUseCase(infoRepo, weightRepo);

      const actual = await usecase.set(u(1), ['ж', '150']);

      assert.deepStrictEqual<Result<InfoSetResult>>(
        actual,
        Result.ok({
          case: 'set' as const,
          data: { gender: 'female', height: cm(150) },
          bmi: null,
        })
      );
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
      assert.deepStrictEqual<Result<InfoSetResult>>(
        actual,
        Result.ok({
          case: 'set' as const,
          data,
          bmi: { case: 'need-user-weight' },
        })
      );
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

      assert.deepStrictEqual(infoRepo.calls.get('set'), [[u(1), data]]);
      assert(actual.isOk);
      assert.isNotNull(actual.value.bmi);
      assert.strictEqual(actual.value.bmi!.case, 'bmi');
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
    assert.deepStrictEqual(validateData(['ж', '100', 'см']), { gender: 'female', height: cm(100) });
    assert.deepStrictEqual(validateData(['м', '300', 'см']), { gender: 'male', height: cm(300) });
  });
});
