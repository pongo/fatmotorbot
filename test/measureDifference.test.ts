import { assert } from 'chai';
import {
  DateMark,
  getDateMark,
  measureDifference,
  sortMeasuresFromNewestToOldest,
} from 'src/app/shared/measureDifference';
import { kg, Measure } from 'src/app/shared/types';

describe('measureDifference()', () => {
  it('should skip future dates', () => {
    const today = new Date(2019, 7 /* aug */, 23);
    const actual = measureDifference(
      [today, kg(50)],
      [[new Date(2020, 7, 23), kg(55)], [new Date(2019, 7, 24), kg(55)]],
    );

    assert.deepEqual(actual, {});
  });

  it('should return summary with previous measures', () => {
    const today = new Date(2019, 7 /* aug */, 23);
    const weekAgo = new Date(2019, 7 /* aug */, 16);
    const monthAgo = new Date(2019, 6 /* jul */, 23);
    const halfYearAgo = new Date(2019, 1 /* feb */, 8);
    const yearAgo = new Date(2018, 7 /* aug */, 23);

    const actual = measureDifference(
      [today, kg(60)],
      [[yearAgo, kg(100)], [halfYearAgo, kg(70)], [monthAgo, kg(60)], [weekAgo, kg(50)]],
    );

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
    const actual = measureDifference(
      [today, kg(50)],
      [[new Date(2019, 7, 23, 15 /* hour */), kg(55)], [new Date(2019, 7, 23, 10 /* hour */), kg(60)]],
    );

    assert.deepEqual(actual, { today: { date: new Date(2019, 7, 23, 10), difference: kg(-10), value: kg(60) } });
  });
});

describe('markPreviousDates()', () => {
  it('should mark each day in array', () => {
    const current = new Date(2019, 7 /* aug */, 23);
    const expected: [Date, DateMark][] = [
      [new Date(2019, 7 /* aug */, 26), 'future'],
      [new Date(2019, 7 /* aug */, 25), 'future'],
      [new Date(2019, 7 /* aug */, 24), 'future'],
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

describe('sortMeasuresFromNewestToOldest()', () => {
  it('should return new sorted array', () => {
    const d = (num: number): Measure<number> => [new Date(2019, 5, num), 0];
    const sortedDays = [5, 4, 3, 2, 1].map(d);
    const reversedDays = [1, 2, 3, 4, 5].map(d);
    const nonSortedDays = [3, 1, 5, 2, 4].map(d);

    assert.deepEqual(sortMeasuresFromNewestToOldest([]), []);
    assert.deepEqual(sortMeasuresFromNewestToOldest(sortedDays), sortedDays);
    assert.deepEqual(sortMeasuresFromNewestToOldest(reversedDays), sortedDays);
    assert.deepEqual(sortMeasuresFromNewestToOldest(nonSortedDays), sortedDays);
    assert.deepEqual(sortMeasuresFromNewestToOldest(sortMeasuresFromNewestToOldest(sortedDays)), sortedDays);
  });
});
