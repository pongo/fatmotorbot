import { assert } from 'chai';
import sinon from 'sinon';
import { BMIUseCase } from 'src/app/core/BMI/BMIUseCase';
import { BMIResultOrError } from 'src/app/core/BMI/types';
import { InfoUseCase } from 'src/app/core/Info/InfoUseCase';
import { WeightCases } from 'src/app/core/Weight/types';
import { validateWeight, WeightUseCase } from 'src/app/core/Weight/WeightUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { InfoRepositoryMockSinon, WeightRepositoryMockSinon } from 'test/repositoryMocks';
import { m, u } from 'test/utils';

const bmiResult: BMIResultOrError = Result.ok({ case: 'need-user-info' as const });
const infoRepository = InfoRepositoryMockSinon({ get: Result.ok(null) });

describe('WeightUseCase', () => {
  describe('add()', () => {
    it('should adds valid weight to db', async () => {
      const today = new Date('2019-08-23');
      const weightRepository = WeightRepositoryMockSinon({ add: Result.ok(), getAll: Result.ok([]) });
      const bmiUseCase = new BMIUseCase(new InfoUseCase(infoRepository, weightRepository));
      const usecase = new WeightUseCase(weightRepository, bmiUseCase);

      const actual = await usecase.add(u(1), today, '11.kg');

      if (actual.isErr) throw new Error('should be ok');
      sinon.assert.calledOnce(weightRepository.add);
      sinon.assert.calledWith(weightRepository.add, u(1), kg(11));
      assert.deepEqual(actual.value, {
        case: WeightCases.addFirst,
        weight: kg(11),
        bmi: bmiResult,
      });
    });

    it('should return error on invalid weight', async () => {
      const today = new Date('2019-08-23');
      const weightRepository = WeightRepositoryMockSinon();
      const bmiUseCase = new BMIUseCase(new InfoUseCase(infoRepository, weightRepository));
      const usecase = new WeightUseCase(weightRepository, bmiUseCase);

      const actual = await usecase.add(u(1), today, '');

      if (actual.isOk) throw Error();
      assert.instanceOf(actual.error, InvalidFormatError);
      sinon.assert.notCalled(weightRepository.add);
      sinon.assert.notCalled(weightRepository.getAll);
    });

    it('should return diff summary', async () => {
      const today = new Date('2019-08-23');
      const yesterday = new Date('2019-08-22');
      const daysAgo = new Date('2019-08-20');
      const weightRepository = WeightRepositoryMockSinon({
        add: Result.ok(),
        getAll: Result.ok([m(yesterday, kg(20)), m(daysAgo, kg(15))]),
      });
      const bmiUseCase = new BMIUseCase(new InfoUseCase(infoRepository, weightRepository));
      const usecase = new WeightUseCase(weightRepository, bmiUseCase);

      const actual = await usecase.add(u(1), today, '10');

      if (actual.isErr) throw new Error('should be ok');
      assert.deepEqual(actual.value, {
        case: WeightCases.addDiff,
        weight: kg(10),
        diff: {
          daysAgo: { date: daysAgo, difference: kg(-5), value: kg(15) },
          yesterday: { date: yesterday, difference: kg(-10), value: kg(20) },
        },
        bmi: bmiResult,
      });
    });
  });

  describe('getCurrent()', () => {
    it('should return empty if there is no measures', async () => {
      const weightRepository = WeightRepositoryMockSinon({ getAll: Result.ok([]) });
      const bmiUseCase = new BMIUseCase(new InfoUseCase(infoRepository, weightRepository));
      const usecase = new WeightUseCase(weightRepository, bmiUseCase);

      const actual = await usecase.getCurrent(u(1), new Date('2019-08-28'));

      if (actual.isErr) throw new Error('should be ok');
      assert.deepEqual(actual.value, { case: WeightCases.currentEmpty });
    });

    describe('should return current weight and empty diff if only one measure', () => {
      it('week ago', async () => {
        const weekAgo = new Date('2019-08-21');
        const current = m(weekAgo, kg(61));
        const weightRepository = WeightRepositoryMockSinon({ getAll: Result.ok([current]) });
        const bmiUseCase = new BMIUseCase(new InfoUseCase(infoRepository, weightRepository));
        const usecase = new WeightUseCase(weightRepository, bmiUseCase);

        const actual = await usecase.getCurrent(u(1), new Date('2019-08-28'));

        if (actual.isErr) throw new Error('should be ok');
        assert.deepEqual(actual.value, { case: WeightCases.currentFirst, current, bmi: bmiResult });
      });

      it('today earlier', async () => {
        const current = m(new Date('2019-08-21 15:00'), kg(61));
        const weightRepository = WeightRepositoryMockSinon({ getAll: Result.ok([current]) });
        const bmiUseCase = new BMIUseCase(new InfoUseCase(infoRepository, weightRepository));
        const usecase = new WeightUseCase(weightRepository, bmiUseCase);

        const actual = await usecase.getCurrent(u(1), new Date('2019-08-21 20:00'));

        if (actual.isErr) throw new Error('should be ok');
        assert.deepEqual(actual.value, { case: WeightCases.currentFirst, current, bmi: bmiResult });
      });
    });

    describe('should return current weight and diff', () => {
      it('yesterday and week ago', async () => {
        const now = new Date('2019-08-29');
        const weekAgo = new Date('2019-08-21');
        const current = m(new Date('2019-08-28'), kg(60));
        const weightRepository = WeightRepositoryMockSinon({ getAll: Result.ok([current, m(weekAgo, kg(61))]) });
        const bmiUseCase = new BMIUseCase(new InfoUseCase(infoRepository, weightRepository));
        const usecase = new WeightUseCase(weightRepository, bmiUseCase);

        const actual = await usecase.getCurrent(u(1), now);

        if (actual.isErr) throw new Error('should be ok');
        assert.deepEqual(actual.value, {
          case: WeightCases.currentDiff,
          current,
          diff: { weekAgo: { date: weekAgo, difference: kg(-1), value: kg(61) } },
          bmi: bmiResult,
        });
      });

      it('today earlier', async () => {
        const now = new Date('2019-08-29 20:00');
        const earlier = new Date('2019-08-29 10:00');
        const yesterday = new Date('2019-08-28');
        const current = m(new Date('2019-08-29 15:00'), kg(61));
        const weightRepository = WeightRepositoryMockSinon({
          getAll: Result.ok([current, m(earlier, kg(60)), m(yesterday, kg(64))]),
        });
        const bmiUseCase = new BMIUseCase(new InfoUseCase(infoRepository, weightRepository));
        const usecase = new WeightUseCase(weightRepository, bmiUseCase);

        const actual = await usecase.getCurrent(u(1), now);

        if (actual.isErr) throw new Error('should be ok');
        assert.deepEqual(actual.value, {
          case: WeightCases.currentDiff,
          current,
          diff: {
            today: { date: earlier, difference: kg(1), value: kg(60) },
            yesterday: { date: yesterday, difference: kg(-3), value: kg(64) },
          },
          bmi: bmiResult,
        });
      });
    });
  });
});

describe('validateWeight()', () => {
  it('value should be not null', () => {
    assert.isNull(validateWeight(null));
  });

  it('value should be >= 1 and <= 500', () => {
    assert.isNull(validateWeight(0));
    assert.isNull(validateWeight(-100));
    assert.isNull(validateWeight(1000));

    assert.equal(validateWeight(50.5), kg(50.5));
    assert.equal(validateWeight(1), kg(1));
    assert.equal(validateWeight(999), kg(999));
  });
});
