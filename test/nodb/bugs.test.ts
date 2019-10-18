import { assert } from 'chai';
import sinon from 'sinon';
import { bmiPresenter } from 'src/app/bot/BMI/bmiPresenter';
import { BMIUseCase } from 'src/app/bot/BMI/BMIUseCase';
import { IInfoRepository, UserInfo } from 'src/app/bot/InfoCommand/InfoRepository';
import { InfoUseCase } from 'src/app/bot/InfoCommand/InfoUseCase';
import { cm, Gender, kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { u } from 'test/utils';

describe('Bugs', () => {
  it('#13', async () => {
    const expected = `ИМТ: 25 — у тебя избыточный вес. Тебе нужно сбросить 1 кг до здорового веса, который для тебя от 62.33 до 77.88 кг. А твой идеальный вес: 69 кг.`;
    assert.equal(bmiPresenter(await getBMIResult('male', 175, 77.9)), expected);
  });
});

async function getBMIResult(gender: Gender, height: number, weight: number) {
  const userInfo: UserInfo = { gender, height: cm(height) };
  const repo: IInfoRepository = { set: sinon.fake.throws(''), get: async () => Result.ok(userInfo) };
  const infoUseCase = new InfoUseCase(repo);
  const usecase = new BMIUseCase(infoUseCase);
  return usecase.get(u(1), kg(weight));
}
