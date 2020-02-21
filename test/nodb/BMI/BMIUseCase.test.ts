import { assert } from 'chai';
import sinon from 'sinon';
import { BMIUseCase } from 'src/app/core/BMI/BMIUseCase';
import { BMIResult } from 'src/app/core/BMI/types';
import { IInfoRepository, UserInfo } from 'src/app/core/Info/InfoRepository';
import { InfoUseCase } from 'src/app/core/Info/InfoUseCase';
import { BMI, cm, kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { u } from 'test/utils';

describe('BMIUseCase', () => {
  it('no user info', async () => {
    const repo: IInfoRepository = { set: sinon.fake.throws(''), get: async () => Result.ok(null) };
    const weightRepo = { getCurrent: sinon.fake.throws('') };
    const infoUseCase = new InfoUseCase(repo, weightRepo);
    const usecase = new BMIUseCase(infoUseCase);

    const actual = await usecase.get(u(1), kg(54));

    assert.deepEqual(actual, Result.ok({ case: 'need-user-info' as const }));
  });

  it('return bmi data', async () => {
    const userInfo: UserInfo = { gender: 'male', height: cm(171) };
    const repo: IInfoRepository = { set: sinon.fake.throws(''), get: async () => Result.ok(userInfo) };
    const weightRepo = { getCurrent: sinon.fake.throws('') };
    const infoUseCase = new InfoUseCase(repo, weightRepo);
    const usecase = new BMIUseCase(infoUseCase);

    const actual = await usecase.get(u(1), kg(54));

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
      ideal: { avg: kg(66), min: kg(63), max: kg(68)},
    };
    assert.deepEqual(actual, Result.ok(expected));
  });
});
