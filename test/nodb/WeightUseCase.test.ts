import { assert } from 'chai';
import sinon from 'sinon';
import { BMIResultOrError } from 'src/app/bot/BMI/BMIUseCase';
import { validateWeight, WeightCases, WeightUseCase } from 'src/app/bot/WeightCommand/WeightUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { m, u } from 'test/utils';

const bmiResult: BMIResultOrError = Result.ok({ case: 'need-user-info' as const });
const bmiUseCase = { get: async () => bmiResult };

describe('WeightUseCase', () => {
  describe('add()', () => {
    it('should adds valid weight to db', async () => {
      const today = new Date('2019-08-23');
      const repository = {
        add: sinon.fake.returns(Result.ok()),
        getAll: async () => Result.ok([]),
      };
      const usecase = new WeightUseCase(repository, bmiUseCase);

      const actual = await usecase.add(u(1), today, '11.kg');

      if (actual.isErr) throw new Error('should be ok');
      sinon.assert.calledOnce(repository.add);
      sinon.assert.calledWith(repository.add, u(1), kg(11));
      assert.deepEqual(actual.value, {
        case: WeightCases.addFirst,
        weight: kg(11),
        bmi: bmiResult,
      });
    });

    it('should return error on invalid weight', async () => {
      const today = new Date('2019-08-23');
      const repository = { add: sinon.fake(), getAll: sinon.fake.throws('should not be called') };
      const usecase = new WeightUseCase(repository, bmiUseCase);

      const actual = await usecase.add(u(1), today, '');

      if (actual.isOk) throw Error();
      assert.instanceOf(actual.error, InvalidFormatError);
      sinon.assert.notCalled(repository.add);
      sinon.assert.notCalled(repository.getAll);
    });

    it('should return diff summary', async () => {
      const today = new Date('2019-08-23');
      const yesterday = new Date('2019-08-22');
      const daysAgo = new Date('2019-08-20');
      const repository = {
        add: async () => Result.ok(),
        getAll: async () => Result.ok([m(yesterday, kg(20)), m(daysAgo, kg(15))]),
      };
      const usecase = new WeightUseCase(repository, bmiUseCase);

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
      const repository = { add: sinon.fake.throws('should not be called'), getAll: async () => Result.ok([]) };
      const usecase = new WeightUseCase(repository, bmiUseCase);

      const actual = await usecase.getCurrent(u(1), new Date('2019-08-28'));

      if (actual.isErr) throw new Error('should be ok');
      assert.deepEqual(actual.value, { case: WeightCases.currentEmpty });
    });

    describe('should return current weight and empty diff if only one measure', () => {
      it('week ago', async () => {
        const weekAgo = new Date('2019-08-21');
        const current = m(weekAgo, kg(61));
        const repository = {
          add: sinon.fake.throws('should not be called'),
          getAll: async () => Result.ok([current]),
        };
        const usecase = new WeightUseCase(repository, bmiUseCase);

        const actual = await usecase.getCurrent(u(1), new Date('2019-08-28'));

        if (actual.isErr) throw new Error('should be ok');
        assert.deepEqual(actual.value, { case: WeightCases.currentFirst, current, bmi: bmiResult });
      });

      it('today earlier', async () => {
        const current = m(new Date('2019-08-21 15:00'), kg(61));
        const repository = {
          add: sinon.fake.throws('should not be called'),
          getAll: async () => Result.ok([current]),
        };
        const usecase = new WeightUseCase(repository, bmiUseCase);

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
        const repository = {
          add: sinon.fake.throws('should not be called'),
          getAll: async () => Result.ok([current, m(weekAgo, kg(61))]),
        };
        const usecase = new WeightUseCase(repository, bmiUseCase);

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
        const repository = {
          add: sinon.fake.throws('should not be called'),
          getAll: async () => Result.ok([current, m(earlier, kg(60)), m(yesterday, kg(64))]),
        };
        const usecase = new WeightUseCase(repository, bmiUseCase);

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
