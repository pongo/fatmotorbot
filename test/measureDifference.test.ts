import { assert } from 'chai';
import {
  DateMark,
  getDateMark,
  measureDifference,
  sortMeasuresFromOldestToNewest,
} from 'src/app/shared/measureDifference';
import { kg, Measure } from 'src/app/shared/types';
import { subDays } from 'date-fns';

const m = <T extends number>(date: Date, value: T): Measure<T> => ({ date, value });

describe('measureDifference()', () => {
  it('should skip future dates', () => {
    const today = new Date(2019, 7 /* aug */, 23);
    const futureMeasures = [m(new Date(2020, 7, 23), kg(55)), m(new Date(2019, 7, 24), kg(55))];
    const actual = measureDifference(m(today, kg(50)), futureMeasures);

    assert.deepEqual(actual, {});
  });

  it('should return summary with previous measures', () => {
    const today = new Date(2019, 7 /* aug */, 23);
    const weekAgo = new Date(2019, 7 /* aug */, 16);
    const monthAgo = new Date(2019, 6 /* jul */, 23);
    const halfYearAgo = new Date(2019, 1 /* feb */, 8);
    const yearAgo = new Date(2018, 7 /* aug */, 23);
    const previousMeasures = [m(yearAgo, kg(100)), m(halfYearAgo, kg(70)), m(monthAgo, kg(60)), m(weekAgo, kg(50))];

    const actual = measureDifference(m(today, kg(60)), previousMeasures);

    assert.deepEqual(actual, {
      halfYearAgo: {
        date: halfYearAgo,
        difference: kg(-10),
        value: kg(70),
      },
      monthAgo: {
        date: monthAgo,
        difference: kg(0),
        value: kg(60),
      },
      weekAgo: {
        date: weekAgo,
        difference: kg(10),
        value: kg(50),
      },
      yearAgo: {
        date: yearAgo,
        difference: kg(-40),
        value: kg(100),
      },
    });
  });

  it('should return oldest today value', () => {
    const today = new Date(2019, 7 /* aug */, 23, 20 /* hour */);
    const todayMeasures = [
      m(new Date(2019, 7, 23, 15 /* hour */), kg(55)),
      m(new Date(2019, 7, 23, 10 /* hour */), kg(60)),
    ];

    const actual = measureDifference(m(today, kg(50)), todayMeasures);

    assert.deepEqual(actual, { today: { date: new Date(2019, 7, 23, 10), difference: kg(-10), value: kg(60) } });
  });

  it('should skip current date', () => {
    const now = new Date('2019-08-25T11:01:57.762Z');
    const current = m(now, kg(50));
    const fewDaysAgo = m(subDays(now, 2), kg(60));
    const previous = [current, fewDaysAgo];

    const actual = measureDifference(current, previous);

    assert.deepEqual(actual, {
      daysAgo: {
        date: fewDaysAgo.date,
        difference: kg(-10),
        value: fewDaysAgo.value,
      },
    });
  });
});

describe('markPreviousDates()', () => {
  it('should mark each day in array', () => {
    const current = new Date(2019, 7 /* aug */, 23, 12 /* hour */);
    const expected: [Date, DateMark][] = [
      [new Date(2019, 7 /* aug */, 26), 'future'],
      [new Date(2019, 7 /* aug */, 25), 'future'],
      [new Date(2019, 7 /* aug */, 24), 'future'],
      [new Date(2019, 7 /* aug */, 23, 12), 'current'],
      [new Date(2019, 7 /* aug */, 23), 'today'],
      [new Date(2019, 7 /* aug */, 22), 'yesterday'],
      [new Date(2019, 7 /* aug */, 21), 'daysAgo'],
      [new Date(2019, 7 /* aug */, 20), 'daysAgo'],
      [new Date(2019, 7 /* aug */, 19), 'daysAgo'],
      [new Date(2019, 7 /* aug */, 18), 'weekAgo'],
      [new Date(2019, 7 /* aug */, 17), 'weekAgo'],
      [new Date(2019, 7 /* aug */, 16), 'weekAgo'],
      [new Date(2019, 7 /* aug */, 15), 'weekAgo'],
      [new Date(2019, 7 /* aug */, 14), 'weekAgo'],
      [new Date(2019, 7 /* aug */, 13), 'weekAgo'],
      [new Date(2019, 7 /* aug */, 12), 'twoWeeksAgo'],
      [new Date(2019, 7 /* aug */, 11), 'twoWeeksAgo'],
      [new Date(2019, 7 /* aug */, 10), 'twoWeeksAgo'],
      [new Date(2019, 7 /* aug */, 9), 'twoWeeksAgo'],
      [new Date(2019, 7 /* aug */, 8), 'twoWeeksAgo'],
      [new Date(2019, 7 /* aug */, 7), 'twoWeeksAgo'],
      [new Date(2019, 7 /* aug */, 6), 'twoWeeksAgo'],
      [new Date(2019, 7 /* aug */, 5), 'twoWeeksAgo'],
      [new Date(2019, 7 /* aug */, 4), 'monthAgo'],
      [new Date(2019, 6 /* jul */, 9), 'monthAgo'],
      [new Date(2019, 6 /* jul */, 8), 'monthsAgo'],
      [new Date(2019, 1 /* feb */, 8), 'halfYearAgo'],
      [new Date(2018, 6 /* jul */, 8), 'yearAgo'],
      [new Date(2010, 6 /* jul */, 8), 'yearsAgo'],
    ];

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
