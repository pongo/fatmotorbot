import { assert } from 'chai';
import { DateMark, getDateMark, measureDifference } from 'src/app/core/services/measureDifference';
import { kg } from 'src/app/shared/types';
import { m, sortM } from 'test/utils';

describe('measureDifference()', () => {
  it('should skip future dates', () => {
    const today = new Date('2019-08-23');
    const futureMeasures = [m(new Date('2020-08-23'), kg(55)), m(new Date('2019-08-24'), kg(55))];
    const actual = measureDifference(m(today, kg(50)), sortM(futureMeasures));

    assert.deepStrictEqual(actual, {});
  });

  it('should return summary with previous measures', () => {
    const today = new Date('2019-08-23');
    const weekAgo = new Date('2019-08-16');
    const monthAgo = new Date('2019-07-23');
    const halfYearAgo = new Date('2019-02-08');
    const yearAgo = new Date('2018-08-23');
    const previousMeasures = [m(yearAgo, kg(100)), m(halfYearAgo, kg(70)), m(monthAgo, kg(60)), m(weekAgo, kg(50))];

    const actual = measureDifference(m(today, kg(60)), sortM(previousMeasures));

    assert.deepStrictEqual(actual, {
      halfYearAgo: { date: halfYearAgo, difference: kg(-10), value: kg(70) },
      monthAgo: { date: monthAgo, difference: kg(0), value: kg(60) },
      weekAgo: { date: weekAgo, difference: kg(10), value: kg(50) },
      yearAgo: { date: yearAgo, difference: kg(-40), value: kg(100) },
    });
  });

  it('should return oldest today value', () => {
    const today = new Date('2019-08-23 20:00');
    const todayEarliest = new Date('2019-08-23 10:00');
    const todayMeasures = [m(new Date('2019-08-23 15:00'), kg(55)), m(todayEarliest, kg(60))];

    const actual = measureDifference(m(today, kg(50)), sortM(todayMeasures));

    assert.deepStrictEqual(actual, { today: { date: todayEarliest, difference: kg(-10), value: kg(60) } });
  });

  it('should skip current date', () => {
    const now = new Date('2019-08-25T11:01:57.762Z');
    const current = m(now, kg(50));
    const fewDaysAgo = m(new Date('2019-08-23T11:01:57.762Z'), kg(60));
    const previous = [current, fewDaysAgo];

    const actual = measureDifference(current, sortM(previous));

    assert.deepStrictEqual(actual, {
      daysAgo: { date: fewDaysAgo.date, difference: kg(-10), value: fewDaysAgo.value },
    });
  });

  it('should do correct float minus', () => {
    const today = new Date('2019-08-23');
    const daysAgo = new Date('2019-08-20');
    const previous = [m(daysAgo, kg(0.1))];

    const actual = measureDifference(m(today, kg(0.3)), sortM(previous));

    assert.deepStrictEqual(actual, { daysAgo: { date: daysAgo, difference: kg(0.2), value: kg(0.1) } });
  });

  it('should return result adjusted to relative date', () => {
    const current = new Date('2019-08-23');
    const weekAgo = new Date('2019-08-16');
    const monthAgo = new Date('2019-07-23');
    const halfYearAgo = new Date('2019-02-08');
    const yearAgo = new Date('2018-08-23');
    const previousMeasures = [m(yearAgo, kg(100)), m(halfYearAgo, kg(70)), m(monthAgo, kg(60)), m(weekAgo, kg(50))];

    assert.deepStrictEqual(measureDifference(m(current, kg(60)), sortM(previousMeasures), new Date('2020-08-23')), {
      yearAgo: { date: monthAgo, difference: kg(0), value: kg(60) },
      yearsAgo: { date: yearAgo, difference: kg(-40), value: kg(100) },
    });

    assert.deepStrictEqual(measureDifference(m(current, kg(60)), sortM(previousMeasures), new Date('2019-08-24')), {
      halfYearAgo: { date: halfYearAgo, difference: kg(-10), value: kg(70) },
      monthAgo: { date: monthAgo, difference: kg(0), value: kg(60) },
      weekAgo: { date: weekAgo, difference: kg(10), value: kg(50) },
      yearAgo: { date: yearAgo, difference: kg(-40), value: kg(100) },
    });
  });
});

describe('markPreviousDates()', () => {
  it('should mark each day in array', () => {
    const current = new Date('2019-08-23 12:00');
    const expected: [Date, DateMark][] = [
      [new Date('2019-08-26'), 'future'],
      [new Date('2019-08-25'), 'future'],
      [new Date('2019-08-24'), 'future'],
      [new Date('2019-08-23 12:00'), 'current'],
      [new Date('2019-08-23'), 'today'],
      [new Date('2019-08-22'), 'yesterday'],
      [new Date('2019-08-21'), 'daysAgo'],
      [new Date('2019-08-20'), 'daysAgo'],
      [new Date('2019-08-19'), 'daysAgo'],
      [new Date('2019-08-18'), 'weekAgo'],
      [new Date('2019-08-17'), 'weekAgo'],
      [new Date('2019-08-16'), 'weekAgo'],
      [new Date('2019-08-15'), 'weekAgo'],
      [new Date('2019-08-14'), 'weekAgo'],
      [new Date('2019-08-13'), 'weekAgo'],
      [new Date('2019-08-12'), 'twoWeeksAgo'],
      [new Date('2019-08-11'), 'twoWeeksAgo'],
      [new Date('2019-08-10'), 'twoWeeksAgo'],
      [new Date('2019-08-9'), 'twoWeeksAgo'],
      [new Date('2019-08-8'), 'twoWeeksAgo'],
      [new Date('2019-08-7'), 'twoWeeksAgo'],
      [new Date('2019-08-6'), 'twoWeeksAgo'],
      [new Date('2019-08-5'), 'twoWeeksAgo'],
      [new Date('2019-08-4'), 'monthAgo'],
      [new Date('2019-07-9'), 'monthAgo'],
      [new Date('2019-07-8'), 'monthsAgo'],
      [new Date('2019-02-8'), 'halfYearAgo'],
      [new Date('2018-07-8'), 'yearAgo'],
      [new Date('2010-07-8'), 'yearsAgo'],
    ];

    const actual = expected.map(([date]) => [date, getDateMark(current, date)]);

    assert.deepStrictEqual(actual, expected);
  });

  it('should correct works with yesterday', () => {
    const expected: [Date, DateMark][] = [
      [new Date('2019-08-23 12:00'), 'current'],
      [new Date('2019-08-22 23:00'), 'yesterday'],
      [new Date('2019-08-22 13:00'), 'yesterday'],
      [new Date('2019-08-22 12:00'), 'yesterday'],
      [new Date('2019-08-22 10:00'), 'yesterday'],
      [new Date('2019-08-21 23:00'), 'daysAgo'],
    ];
    const current = new Date('2019-08-23 12:00');

    const actual = expected.map(([date]) => [date, getDateMark(current, date)]);

    assert.deepStrictEqual(actual, expected);
  });

  it('should return result adjusted to relative date', () => {
    const expected: [Date, DateMark][] = [
      [new Date('2019-08-25'), 'future'],
      [new Date('2019-08-24'), 'today'],
      [new Date('2019-08-23 12:00'), 'current'],
      [new Date('2019-08-23'), 'yesterday'],
      [new Date('2019-08-22'), 'daysAgo'],
      [new Date('2019-08-21'), 'daysAgo'],
      [new Date('2019-08-20'), 'daysAgo'],
    ];
    const current = new Date('2019-08-23 12:00');

    const actual = expected.map(([date]) => [date, getDateMark(current, date, new Date('2019-08-24'))]);

    assert.deepStrictEqual(actual, expected);
  });
});
