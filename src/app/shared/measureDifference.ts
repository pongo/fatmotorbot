import { differenceInCalendarDays, isSameSecond } from 'date-fns';
import { Measure, MeasuresFromNewestToOldest, MeasuresFromOldestToNewest } from 'src/app/shared/types';
import { minus } from 'src/shared/utils/parseNumber';

export type MeasureDifferenceSummary<T extends number> = {
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
  | 'current'
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

/**
 * Возвращает сравнение текущего замера с предыдущими.
 *
 * @param current Текущий замер
 * @param previous Все замеры в порядке от новых к старым
 * @param relativeDate Сегодняшняя дата
 */
export function measureDifference<T extends number>(
  current: Measure<T>,
  previous: MeasuresFromNewestToOldest<T>,
  relativeDate?: Date,
): MeasureDifferenceSummary<T> {
  const sorted: MeasuresFromOldestToNewest<T> = [...previous].reverse();
  const result: MeasureDifferenceSummary<T> = {};

  for (const { date, value } of sorted) {
    const mark = getDateMark(current.date, date, relativeDate);
    if (mark === 'current' || mark === 'future') continue;
    if (mark in result) continue; // если уже записан, то пропуск: записываем только самый старый замер
    result[mark] = { date, value, difference: minus(current.value, value) };
  }

  return result;
}

/**
 * Маркирует указанную дату (эта дата была неделю назад, эта — месяц и т.п.).
 *
 * @param current дата текущего замера
 * @param other дата другого замера
 * @param relativeDate с этой датой идет сравнение
 */
export function getDateMark(current: Date, other: Date, relativeDate: Date = current): DateMark {
  if (isSameSecond(current, other)) return 'current';

  // получаем количество дней между датами.
  // т.к. замеры идут последовательно, то чем больше дней, тем старее дата.
  // и нам нужен только самый старый замер (т.е. наибольшее количество дней).
  const daysAgo = differenceInCalendarDays(relativeDate, other);
  const dateMarks: [number, DateMark][] = [
    [-1, 'future'],
    [0, 'today'],
    [1, 'yesterday'],
    [4, 'daysAgo'],
    [7 + 3, 'weekAgo'],
    [14 + 4, 'twoWeeksAgo'],
    [14 + 31, 'monthAgo'],
    [4 * 31, 'monthsAgo'],
    [9 * 31, 'halfYearAgo'],
    [15 * 31, 'yearAgo'],
  ];
  for (const [ago, dateMark] of dateMarks) {
    if (daysAgo <= ago) return dateMark;
  }
  return 'yearsAgo';
}
