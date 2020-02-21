import { assert } from 'chai';
import sinon from 'sinon';
import { SlonikError } from 'slonik';
import { bmiPresenter } from 'src/app/core/BMI/bmiPresenter';
import { BMIUseCase } from 'src/app/core/BMI/BMIUseCase';
import { InfoUseCase } from 'src/app/core/Info/InfoUseCase';
import { IInfoRepository, UserInfo } from 'src/app/core/Info/types';
import { DatabaseError } from 'src/app/shared/errors';
import { cm, Gender, kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { WeightRepositoryMockSinon } from 'test/repositoryMocks';
import { u } from 'test/utils';

describe('bmiPresenter()', () => {
  it('error', () => {
    assert.equal(bmiPresenter(Result.err(new DatabaseError(new SlonikError('ops')))), 'ИМТ: <i>ошибка в бд</i>');
  });

  it('need user info', () => {
    assert.equal(
      bmiPresenter(Result.ok({ case: 'need-user-info' })),
      'Для расчета ИМТ не хватает данных. Укажи их при помощи /info',
    );
  });

  describe('bmi data', () => {
    it('Very severely underweight', async () => {
      assert.equal(
        bmiPresenter(await getBMIResult('male', 185, 49)),
        `ИМТ: 13.68 — у тебя выраженный дефицит веса, скорее ко врачу! Тебе нужно набрать 23 кг до здорового веса, который для тебя от 71.62 до 89.49 кг. Первым шагом тебе нужно набрать 5 кг — тогда у тебя будет «обычный» дефицит веса. А твой идеальный вес: 76 кг (73–83).`,
      );
    });

    it('Severely underweight', async () => {
      assert.equal(
        bmiPresenter(await getBMIResult('male', 185, 57)),
        `ИМТ: 15.92 — у тебя дефицит веса. Тебе нужно набрать 15 кг до здорового веса, который для тебя от 71.62 до 89.49 кг. Первым шагом тебе нужно набрать 8 кг — тогда у тебя будет неопасный дефицит. А твой идеальный вес: 76 кг (73–83).`,
      );
    });

    it('Underweight', async () => {
      assert.equal(
        bmiPresenter(await getBMIResult('male', 171, 54)),
        `ИМТ: 18.36 — у тебя неопасный дефицит веса. Тебе нужно набрать 5 кг до здорового веса, который для тебя от 58.83 до 73.5 кг. А твой идеальный вес: 66 кг (63–68).`,
      );
    });

    it('Normal', async () => {
      assert.equal(
        bmiPresenter(await getBMIResult('male', 185, 75)),
        `ИМТ: 20.94 — у тебя здоровый вес 💪. Твоя граница здорового веса: от 71.62 до 89.49 кг. А твой идеальный вес: 76 кг (73–83).`,
      );
    });

    it('Overweight', async () => {
      assert.equal(
        bmiPresenter(await getBMIResult('male', 185, 95)),
        `ИМТ: 26.53 — у тебя избыточный вес. Тебе нужно сбросить 6 кг до здорового веса, который для тебя от 71.62 до 89.49 кг. А твой идеальный вес: 76 кг (73–83).`,
      );
    });

    it('Obese I', async () => {
      assert.equal(
        bmiPresenter(await getBMIResult('male', 185, 115)),
        `ИМТ: 32.12 — у тебя ожирение I степени. Тебе нужно сбросить 26 кг до здорового веса, который для тебя от 71.62 до 89.49 кг. Первым шагом тебе нужно сбросить 7 кг — тогда у тебя будет «всего лишь» избыточный вес. А твой идеальный вес: 76 кг (73–83).`,
      );
    });

    it('Obese II', async () => {
      assert.equal(
        bmiPresenter(await getBMIResult('male', 185, 135)),
        `ИМТ: 37.7 — у тебя ожирение II степени. Тебе нужно сбросить 46 кг до здорового веса, который для тебя от 71.62 до 89.49 кг. Первым шагом тебе нужно сбросить 9 кг — тогда у тебя будет I степень. А твой идеальный вес: 76 кг (73–83).`,
      );
    });

    it('Obese III', async () => {
      assert.equal(
        bmiPresenter(await getBMIResult('male', 185, 150)),
        `ИМТ: 41.89 — у тебя ожирение III степени. Тебе нужно сбросить 61 кг до здорового веса, который для тебя от 71.62 до 89.49 кг. Первым шагом тебе нужно сбросить 6 кг — тогда у тебя будет II степень. А твой идеальный вес: 76 кг (73–83).`,
      );
    });
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
