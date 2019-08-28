import { assert } from 'chai';
import sinon from 'sinon';
import { validateWeight, WeightUseCase } from 'src/app/bot/WeightCommand/WeightUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { kg, Measure, TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

const u = (id: number) => id as TelegramUserId;
const m = <T extends number>(date: Date, value: T): Measure<T> => ({ date, value });

describe('WeightUseCase', () => {
  describe('add()', () => {
    it('should adds valid weight to db', async () => {
      const today = new Date('2019-08-23');
      const repository = {
        add: sinon.fake.returns(Result.ok()),
        getAll: async () => Result.ok([]),
      };
      const usecase = new WeightUseCase(repository);

      const actual = await usecase.add(u(1), today, '11.kg');

      if (actual.isErr) throw new Error('should be ok');
      sinon.assert.calledOnce(repository.add);
      sinon.assert.calledWith(repository.add, u(1), kg(11));
      assert.deepEqual(actual.value, {
        weight: kg(11),
        diff: {},
      });
      assert.isTrue(isEmptyObject(actual.value.diff));

      // https://stackoverflow.com/a/32108184/136559
      function isEmptyObject(obj: object): boolean {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
      }
    });

    it('should return error on invalid weight', async () => {
      const today = new Date('2019-08-23');
      const repository = { add: sinon.fake(), getAll: sinon.fake.throws('should not be called') };
      const usecase = new WeightUseCase(repository);

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
      const usecase = new WeightUseCase(repository);

      const actual = await usecase.add(u(1), today, '10');

      if (actual.isErr) throw new Error('should be ok');
      assert.deepEqual(actual.value, {
        weight: kg(10),
        diff: {
          daysAgo: { date: daysAgo, difference: kg(-5), value: kg(15) },
          yesterday: { date: yesterday, difference: kg(-10), value: kg(20) },
        },
      });
    });
  });

  describe('getCurrent()', () => {
    it('should return empty if there is no measures', async () => {
      // const today = new Date('2019-08-28');
      // const weekAgo = new Date('2019-08-21');
      // m(today, kg(60)), m(weekAgo, kg(61))
      const repository = {
        add: sinon.fake.throws('should not be called'),
        getAll: async () => Result.ok([]),
      };
      const usecase = new WeightUseCase(repository);

      const actual = await usecase.getCurrent(u(1));

      if (actual.isErr) throw new Error('should be ok');
      assert.deepEqual(actual.value, { weight: null, diff: {} });
    });

    it('should return current weight and empty diff if only one measure', async () => {
      const weekAgo = new Date('2019-08-21');
      const repository = {
        add: sinon.fake.throws('should not be called'),
        getAll: async () => Result.ok([m(weekAgo, kg(61))]),
      };
      const usecase = new WeightUseCase(repository);

      const actual = await usecase.getCurrent(u(1));

      if (actual.isErr) throw new Error('should be ok');
      assert.deepEqual(actual.value, { weight: kg(61), diff: {} });
    });

    it('should return current weight and diff', async () => {
      const yesterday = new Date('2019-08-28');
      const weekAgo = new Date('2019-08-21');
      const repository = {
        add: sinon.fake.throws('should not be called'),
        getAll: async () => Result.ok([m(yesterday, kg(60)), m(weekAgo, kg(61))]),
      };
      const usecase = new WeightUseCase(repository);

      const actual = await usecase.getCurrent(u(1));

      if (actual.isErr) throw new Error('should be ok');
      assert.deepEqual(actual.value, {
        weight: kg(60),
        diff: { weekAgo: { date: weekAgo, difference: kg(-1), value: kg(61) } },
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
    assert.isNull(validateWeight(501));

    assert.equal(validateWeight(50.5), kg(50.5));
    assert.equal(validateWeight(1), kg(1));
    assert.equal(validateWeight(500), kg(500));
  });
});
