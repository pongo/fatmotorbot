import { assert } from 'chai';
import {
  DateMark,
  getDateMark,
  measureDifference,
  sortMeasuresFromOldestToNewest,
} from 'src/app/shared/measureDifference';
import { kg, Measure } from 'src/app/shared/types';

const m = <T extends number>(date: Date, value: T): Measure<T> => ({ date, value });

describe('measureDifference()', () => {
  it('should skip future dates', () => {
    const today = new Date('2019-08-23');
    const futureMeasures = [m(new Date('2020-08-23'), kg(55)), m(new Date('2019-08-24'), kg(55))];
    const actual = measureDifference(m(today, kg(50)), futureMeasures);

    assert.deepEqual(actual, {});
  });

  it('should return summary with previous measures', () => {
    const today = new Date('2019-08-23');
    const weekAgo = new Date('2019-08-16');
    const monthAgo = new Date('2019-07-23');
    const halfYearAgo = new Date('2019-02-08');
    const yearAgo = new Date('2018-08-23');
    const previousMeasures = [m(yearAgo, kg(100)), m(halfYearAgo, kg(70)), m(monthAgo, kg(60)), m(weekAgo, kg(50))];

    const actual = measureDifference(m(today, kg(60)), previousMeasures);

    assert.deepEqual(actual, {
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

    const actual = measureDifference(m(today, kg(50)), todayMeasures);

    assert.deepEqual(actual, { today: { date: todayEarliest, difference: kg(-10), value: kg(60) } });
  });

  it('should skip current date', () => {
    const now = new Date('2019-08-25T11:01:57.762Z');
    const current = m(now, kg(50));
    const fewDaysAgo = m(new Date('2019-08-23T11:01:57.762Z'), kg(60));
    const previous = [current, fewDaysAgo];

    const actual = measureDifference(current, previous);

    assert.deepEqual(actual, { daysAgo: { date: fewDaysAgo.date, difference: kg(-10), value: fewDaysAgo.value } });
  });

  it('should do correct float minus', () => {
    const today = new Date('2019-08-23');
    const daysAgo = new Date('2019-08-20');
    const previous = [m(daysAgo, kg(0.1))];

    const actual = measureDifference(m(today, kg(0.3)), previous);

    assert.deepEqual(actual, { daysAgo: { date: daysAgo, difference: kg(0.2), value: kg(0.1) } });
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

    assert.deepEqual(actual, expected);
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
    const current = expected[0][0];

    const actual = expected.map(([date]) => [date, getDateMark(current, date)]);

    assert.deepEqual(actual, expected);
  });
});

describe('sortMeasuresFromOldestToNewest()', () => {
  it('should return new sorted array', () => {
    const d = (num: number): Measure<number> => m(new Date(2019, 5, num), 0);
    const sortedDays = [1, 2, 3, 4, 5].map(d);
    const reversedDays = [5, 4, 3, 2, 1].map(d);
    const nonSortedDays = [3, 1, 5, 2, 4].map(d);

    assert.deepEqual(sortMeasuresFromOldestToNewest([]), []);
    assert.deepEqual(sortMeasuresFromOldestToNewest(sortedDays), sortedDays);
    assert.deepEqual(sortMeasuresFromOldestToNewest(reversedDays), sortedDays);
    assert.deepEqual(sortMeasuresFromOldestToNewest(nonSortedDays), sortedDays);
    assert.deepEqual(sortMeasuresFromOldestToNewest(sortMeasuresFromOldestToNewest(sortedDays)), sortedDays);
  });
});
