import { assert } from 'chai';
import { Measure } from '../../src/app/shared/types';
import { sortMeasuresFromNewestToOldest } from '../utils';

const m = <T extends number>(date: Date, value: T): Measure<T> => ({ date, value });

describe('sortMeasuresFromNewestToOldest()', () => {
  it('should return new sorted array', () => {
    const d = (num: number): Measure<number> => m(new Date(2019, 5, num), 0);
    const sortedDays = [5, 4, 3, 2, 1].map(d);
    const reversedDays = [1, 2, 3, 4, 5].map(d);
    const nonSortedDays = [3, 1, 5, 2, 4].map(d);

    assert.sameDeepOrderedMembers(sortMeasuresFromNewestToOldest([]), []);
    assert.sameDeepOrderedMembers(sortMeasuresFromNewestToOldest(sortedDays), sortedDays);
    assert.sameDeepOrderedMembers(sortMeasuresFromNewestToOldest(reversedDays), sortedDays);
    assert.sameDeepOrderedMembers(sortMeasuresFromNewestToOldest(nonSortedDays), sortedDays);
    assert.sameDeepOrderedMembers(sortMeasuresFromNewestToOldest(sortMeasuresFromNewestToOldest(sortedDays)), sortedDays);
  });
});
