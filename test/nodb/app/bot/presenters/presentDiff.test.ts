import { assert } from 'chai';
import { presentDiff } from 'src/app/bot/WeightCommand/presenters/shared';
import { getDateMark, MeasureDifferenceSummary } from 'src/app/core/services/measureDifference';
import { kg, Kg } from 'src/app/shared/types';

describe('presentDiff()', () => {
  it('should present relative dates', () => {
    const current = new Date('2019-08-23 12:00');
    const expected: [Date, string][] = [
      [new Date('2019-08-26'), ''],
      [new Date('2019-08-25'), ''],
      [new Date('2019-08-24'), ''],
      [new Date('2019-08-23 12:00'), ''],
      [new Date('2019-08-23'), '• Сегодня ранее: 55 (+1)'],
      [new Date('2019-08-22'), '• Вчера: 55 (+1)'],
      [new Date('2019-08-21'), '• Пару дней назад: 55 (+1)'],
      [new Date('2019-08-20'), '• Пару дней назад: 55 (+1)'],
      [new Date('2019-08-19'), '• Пару дней назад: 55 (+1)'],
      [new Date('2019-08-18'), '• Неделю назад: 55 (+1)'],
      [new Date('2019-08-17'), '• Неделю назад: 55 (+1)'],
      [new Date('2019-08-16'), '• Неделю назад: 55 (+1)'],
      [new Date('2019-08-15'), '• Неделю назад: 55 (+1)'],
      [new Date('2019-08-14'), '• Неделю назад: 55 (+1)'],
      [new Date('2019-08-13'), '• Неделю назад: 55 (+1)'],
      [new Date('2019-08-12'), '• Две недели назад: 55 (+1)'],
      [new Date('2019-08-11'), '• Две недели назад: 55 (+1)'],
      [new Date('2019-08-10'), '• Две недели назад: 55 (+1)'],
      [new Date('2019-08-9'), '• Две недели назад: 55 (+1)'],
      [new Date('2019-08-8'), '• Две недели назад: 55 (+1)'],
      [new Date('2019-08-7'), '• Две недели назад: 55 (+1)'],
      [new Date('2019-08-6'), '• Две недели назад: 55 (+1)'],
      [new Date('2019-08-5'), '• Две недели назад: 55 (+1)'],
      [new Date('2019-08-4'), '• Месяц назад: 55 (+1)'],
      [new Date('2019-07-9'), '• Месяц назад: 55 (+1)'],
      [new Date('2019-07-8'), '• Пару месяцев назад: 55 (+1)'],
      [new Date('2019-02-8'), '• Полгода назад: 55 (+1)'],
      [new Date('2018-07-8'), '• Год назад: 55 (+1)'],
      [new Date('2010-07-8'), '• Годы назад: 55 (+1)'],
    ];

    const diffs: [Date, MeasureDifferenceSummary<Kg>][] = expected.map(([date]) => {
      const mark = getDateMark(current, date);
      return [date, { ...{}, [mark]: { date, difference: kg(1), value: kg(55) } }];
    });

    const actual = diffs.map(([date, diff]) => [date, presentDiff(diff)]);

    assert.deepEqual(actual, expected);
  });

  it('should present multiple diffs', () => {
    assert.strictEqual(
      presentDiff({
        today: { date: new Date('2019-08-23 12:00'), difference: kg(-3), value: kg(60) },
        weekAgo: { date: new Date('2019-08-15'), difference: kg(0), value: kg(63) },
      }),
      '• Сегодня ранее: 60 (−3)\n• Неделю назад: 63'
    );

    assert.strictEqual(
      presentDiff({
        yesterday: { date: new Date('2019-08-23'), difference: kg(-3), value: kg(60) },
        weekAgo: { date: new Date('2019-08-15'), difference: kg(0), value: kg(63) },
      }),
      '• Вчера: 60 (−3)\n• Неделю назад: 63'
    );

    assert.strictEqual(
      presentDiff({
        weekAgo: { date: new Date('2019-08-23'), difference: kg(-3), value: kg(60) },
        monthAgo: { date: new Date('2019-07-23'), difference: kg(0), value: kg(63) },
      }),
      '• Неделю назад: 60 (−3)\n• Месяц: 63'
    );
  });

  it('should present kg difference', () => {
    assert.strictEqual(presentDiff(createDiff(-1)), '• Сегодня ранее: 55 (−1)');
    assert.strictEqual(presentDiff(createDiff(0)), '• Сегодня ранее: 55');
    assert.strictEqual(presentDiff(createDiff(1)), '• Сегодня ранее: 55 (+1)');
    assert.strictEqual(presentDiff(createDiff(3.41)), '• Сегодня ранее: 55 (+3.41)');

    function createDiff(difference: number, value = 55): MeasureDifferenceSummary<Kg> {
      return { today: { date: new Date(), difference: kg(difference), value: kg(value) } };
    }
  });

  it('should present kg values', () => {
    assert.strictEqual(presentDiff(createDiff(55)), '• Сегодня ранее: 55');
    assert.strictEqual(presentDiff(createDiff(55.7)), '• Сегодня ранее: 55.7');
    assert.strictEqual(presentDiff(createDiff(55.7, 1)), '• Сегодня ранее: 55.7 (+1)');

    function createDiff(value: number, difference = 0): MeasureDifferenceSummary<Kg> {
      return { today: { date: new Date(), difference: kg(difference), value: kg(value) } };
    }
  });
});
