import { assert } from 'chai';
import { SlonikError } from 'slonik';
import { weightPresenter } from 'src/app/bot/WeightCommand/weightPresenter';
import {
  CurrentWeightDiff,
  CurrentWeightFirst,
  WeightAddedDiff,
  WeightCases,
} from 'src/app/bot/WeightCommand/WeightUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

describe('weightPresenter()', () => {
  describe('add()', () => {
    it('error', () => {
      assert.equal(weightPresenter(Result.err(new InvalidFormatError()), new Date()), 'Какой-какой у тебя вес?');

      assert.equal(
        weightPresenter(Result.err(new SlonikError('oops')), new Date()),
        'Что-то не так с базой данных. Вызывайте техподдержку!',
      );
    });

    it('first add', () => {
      assert.equal(
        weightPresenter(Result.ok({ case: WeightCases.addFirst, weight: kg(100) }), new Date()),
        `Твой вес: 100 кг.\n\nПервый шаг сделан. Регулярно делай замеры, например, каждую пятницу утром.`,
      );
    });

    it('not first', () => {
      const data: WeightAddedDiff = {
        case: WeightCases.addDiff,
        weight: kg(50),
        diff: {
          daysAgo: { difference: kg(1), value: kg(49), date: new Date('2019-08-27') },
          monthAgo: { difference: kg(-5), value: kg(55), date: new Date('2019-07-28') },
        },
      };
      assert.equal(
        weightPresenter(Result.ok(data), new Date('2019-08-29')),
        `Твой вес: 50 кг.\n\n• Пару дней назад: 49 (+1)\n• Месяц: 55 (−5)`,
      );
    });
  });

  describe('getCurrent()', () => {
    it('error', () => {
      assert.equal(
        weightPresenter(Result.err(new SlonikError('oops')), new Date()),
        'Что-то не так с базой данных. Вызывайте техподдержку!',
      );
    });

    it('no measures', () => {
      assert.equal(
        weightPresenter(Result.ok({ case: WeightCases.currentEmpty }), new Date('2019-08-29')),
        `Впервые у меня? Встань на весы и взвесься. Затем добавь вес командой, например:\n\n/weight 88.41`,
      );
    });

    it('one measure', () => {
      function gen(date: Date) {
        const data: CurrentWeightFirst = { case: WeightCases.currentFirst, current: { date, value: kg(100) } };
        return Result.ok(data);
      }

      assert.equal(
        weightPresenter(gen(new Date('2019-08-29')), new Date('2019-08-29')),
        `Твой вес: 100 кг.\n\nРегулярно делай замеры, например, каждую пятницу утром.`,
      );

      assert.equal(
        weightPresenter(gen(new Date('2019-08-22')), new Date('2019-08-29')),
        `Твой вес: 100 кг.\n\nПрошла неделя с последнего замера, пора взвешиваться!`,
      );

      assert.equal(
        weightPresenter(gen(new Date('2019-07-22')), new Date('2019-08-29')),
        `Твой вес: 100 кг.\n\nНесколько недель прошло, сколько ты теперь весишь?`,
      );

      assert.equal(
        weightPresenter(gen(new Date('2019-05-22')), new Date('2019-08-29')),
        `Твой вес: 100 кг.\n\nИ было это пару месяцев назад, сколько же ты теперь весишь?`,
      );

      assert.equal(
        weightPresenter(gen(new Date('2018-05-22')), new Date('2019-08-29')),
        `Твой вес: 100 кг.\n\nНо было это чертовски давно, рискнешь встать на весы?`,
      );
    });

    it('measures', () => {
      const data: CurrentWeightDiff = {
        case: WeightCases.currentDiff,
        current: { date: new Date('2019-08-28'), value: kg(50) },
        diff: {
          daysAgo: { difference: kg(1), value: kg(49), date: new Date('2019-08-27') },
          monthAgo: { difference: kg(-5), value: kg(55), date: new Date('2019-07-28') },
        },
      };
      assert.equal(
        weightPresenter(Result.ok(data), new Date('2019-08-29')),
        `Вес вчера: 50 кг.\n\n• Пару дней назад: 49 (+1)\n• Месяц: 55 (−5)`,
      );
    });
  });
});
