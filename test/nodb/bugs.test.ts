import { assert } from 'chai';
import sinon from 'sinon';
import { bmiPresenter } from 'src/app/core/BMI/bmiPresenter';
import { BMIUseCase } from 'src/app/core/BMI/BMIUseCase';
import { IInfoRepository, UserInfo } from 'src/app/core/Info/InfoRepository';
import { InfoUseCase } from 'src/app/core/Info/InfoUseCase';
import { cm, Gender, kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { WeightRepositoryMockSinon } from 'test/repositoryMocks';
import { u } from 'test/utils';

describe('Bugs', () => {
  it('#13', async () => {
    const expected = `ИМТ: 25 — у тебя избыточный вес. Тебе нужно сбросить 1 кг до здорового веса, который для тебя от 62.33 до 77.88 кг. А твой идеальный вес: 69 кг (66–73).`;
    assert.equal(bmiPresenter(await getBMIResult('male', 175, 77.9)), expected);
  });
});

async function getBMIResult(gender: Gender, height: number, weight: number) {
  const userInfo: UserInfo = { gender, height: cm(height) };
  const repo: IInfoRepository = { set: sinon.fake.throws(''), get: async () => Result.ok(userInfo) };
  const weightRepo = WeightRepositoryMockSinon();
  const infoUseCase = new InfoUseCase(repo, weightRepo);
  const usecase = new BMIUseCase(infoUseCase);
  return usecase.get(u(1), kg(weight));
}
