import { assert } from 'chai';
import sinon from 'sinon';
import { IInfoRepository, UserInfo } from 'src/app/core/repositories/InfoRepository';
import { calcBMIResult, GetBMIUseCase } from 'src/app/core/useCases/BMI/GetBMIUseCase';
import { BMIResult } from 'src/app/core/useCases/BMI/utils/types';
import { InfoUseCase } from 'src/app/core/useCases/Info/InfoUseCase';
import { BMI, cm, kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { InfoRepositoryMockSinon, WeightRepositoryMockSinon } from 'test/repositoryMocks';
import { u } from 'test/utils';

describe('BMIUseCase', () => {
  const userInfo: UserInfo = { gender: 'male', height: cm(171) };
  const expected: BMIResult = {
    case: 'bmi',
    bmi: 18.36 as BMI,
    categoryName: 'Underweight',
    healthyRange: [kg(58.83), kg(73.5)],
    suggest: {
      alreadyHealthy: false,
      toHealthy: kg(5),
      toNext: null,
    },
    ideal: { avg: kg(66), min: kg(63), max: kg(68) },
  };

  it('no user info', async () => {
    const repo: IInfoRepository = { set: sinon.fake.throws(''), get: async () => Result.ok(null) };
    const weightRepo = WeightRepositoryMockSinon();
    const infoUseCase = new InfoUseCase(repo, weightRepo);
    const usecase = new GetBMIUseCase(infoUseCase, weightRepo);

    const actual = await usecase.get(u(1), { weight: kg(54) });

    assert.deepEqual(actual, Result.ok({ case: 'need-user-info' as const }));
  });

  it('return bmi data', async () => {
    const infoRepository = InfoRepositoryMockSinon({ get: Result.ok(userInfo) });
    const weightRepo = WeightRepositoryMockSinon();
    const infoUseCase = new InfoUseCase(infoRepository, weightRepo);
    const usecase = new GetBMIUseCase(infoUseCase, weightRepo);

    const actual = await usecase.get(u(1), { weight: kg(54) });

    assert.deepEqual(actual, Result.ok(expected));
  });

  it('should return bmi without repos', async () => {
    const infoRepository = InfoRepositoryMockSinon();
    const weightRepo = WeightRepositoryMockSinon();
    const infoUseCase = new InfoUseCase(infoRepository, weightRepo);
    const usecase = new GetBMIUseCase(infoUseCase, weightRepo);

    const actual = await usecase.get(u(1), { weight: kg(54), userInfo });

    assert.deepEqual(actual, Result.ok(expected));
  });

  it('calcBMIResult()', () => {
    const actual = calcBMIResult(kg(54), userInfo);
    assert.deepEqual(actual, expected);
  });
});
