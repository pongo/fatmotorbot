import { differenceInCalendarDays } from 'date-fns';
import { Measure } from 'src/app/shared/types';

export type MeasureDifferenceResult<T extends number> = {
  today?: MeasureDifference<T>;
  yesterday?: MeasureDifference<T>;
  daysAgo?: MeasureDifference<T>;
  weekAgo?: MeasureDifference<T>;
  twoWeeksAgo?: MeasureDifference<T>;
  monthAgo?: MeasureDifference<T>;
  monthsAgo?: MeasureDifference<T>;
  halfYearAgo?: MeasureDifference<T>;
  yearAgo?: MeasureDifference<T>;
  yearsAgo?: MeasureDifference<T>;
};

export type MeasureDifference<T extends number> = {
  date: Date;
  difference: T;
  value: T;
};

export type DateMark =
  | 'future'
  | 'today'
  | 'yesterday'
  | 'daysAgo'
  | 'weekAgo'
  | 'twoWeeksAgo'
  | 'monthAgo'
  | 'monthsAgo'
  | 'halfYearAgo'
  | 'yearAgo'
  | 'yearsAgo';

export type MeasureDifferenceFn<T extends number> = (
  current: Measure<T>,
  previous: Measure<T>[],
) => MeasureDifferenceResult<T>;

export function measureDifference<T extends number>(
  current: Measure<T>,
  previous: Measure<T>[],
): MeasureDifferenceResult<T> {
  const [currentDate, currentValue] = current;
  const sorted = sortMeasuresFromNewestToOldest(previous);

  let result: MeasureDifferenceResult<T> = {};
  for (const [date, value] of sorted) {
    const mark = getDateMark(currentDate, date);
    if (mark === 'future') continue;
    result = addMeasure({ result, mark, currentValue, date, value });
  }

  return result;
}

function addMeasure<T extends number>({
  result,
  mark,
  currentValue,
  date,
  value,
}: {
  result: MeasureDifferenceResult<T>;
  mark: DateMark;
  currentValue: T;
  date: Date;
  value: T;
}) {
  return { ...result, [mark]: { date, value, difference: currentValue - value } };
}

// eslint-disable-next-line complexity
export function getDateMark(current: Date, other: Date): DateMark {
  const daysAgo = differenceInCalendarDays(current, other);
  if (daysAgo < 0) return 'future';
  if (daysAgo === 0) return 'today';
  if (daysAgo === 1) return 'yesterday';
  if (daysAgo <= 4) return 'daysAgo';
  if (daysAgo <= 7 + 3) return 'weekAgo';
  if (daysAgo <= 14 + 4) return 'twoWeeksAgo';
  if (daysAgo <= 14 + 31) return 'monthAgo';
  if (daysAgo <= 3 * 31) return 'monthsAgo';
  if (daysAgo <= 9 * 31) return 'halfYearAgo';
  if (daysAgo <= 15 * 31) return 'yearAgo';
  return 'yearsAgo';
}

export function sortMeasuresFromNewestToOldest<T extends number>(array: Measure<T>[]): Measure<T>[] {
  return [...array].sort(([aDate], [bDate]) => +bDate - +aDate); // плюсы нужны, чтобы typescript не ругался
}
