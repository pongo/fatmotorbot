import { differenceInCalendarDays, isSameSecond } from 'date-fns';
import { MeasuresFromNewestToOldest } from 'src/app/bot/WeightCommand/WeightRepository';
import { Measure } from 'src/app/shared/types';
import { minus } from 'src/shared/utils/parseNumber';
import { isEmptyObject } from 'src/shared/utils/utils';

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
// eslint-disable-next-line complexity
export function measureDifference<T extends number>(
  current: Measure<T>,
  previous: MeasuresFromNewestToOldest<T>,
  relativeDate?: Date,
): MeasureDifferenceSummary<T> | undefined {
  const sorted = [...previous].reverse(); // reverse() сортирует от самых старых к новым
  const result: MeasureDifferenceSummary<T> = {};

  for (const { date, value } of sorted) {
    const mark = getDateMark(current.date, date, relativeDate);
    if (mark === 'current' || mark === 'future') continue;
    if (mark in result) continue; // если уже записан, то пропуск: записываем только самый старый замер
    result[mark] = { date, value, difference: minus(current.value, value) };
  }

  return isEmptyObject(result) ? undefined : result;
}

/**
 * Маркирует указанную дату (эта дата была неделю назад, эта — месяц и т.п.).
 *
 * @param current дата текущего замера
 * @param other дата другого замера
 * @param relativeDate с этой датой идет сравнение
 */
// eslint-disable-next-line complexity
export function getDateMark(current: Date, other: Date, relativeDate: Date = current): DateMark {
  if (isSameSecond(current, other)) return 'current';

  // получаем количество дней между датами.
  // т.к. замеры идут последовательно, то чем больше дней, тем старее дата.
  // и нам нужен только самый старый замер (т.е. наибольшее количество дней).
  const daysAgo = differenceInCalendarDays(relativeDate, other);
  if (daysAgo < 0) return 'future';
  if (daysAgo === 0) return 'today';
  if (daysAgo === 1) return 'yesterday';
  if (daysAgo <= 4) return 'daysAgo';
  if (daysAgo <= 7 + 3) return 'weekAgo';
  if (daysAgo <= 14 + 4) return 'twoWeeksAgo';
  if (daysAgo <= 14 + 31) return 'monthAgo';
  if (daysAgo <= 4 * 31) return 'monthsAgo';
  if (daysAgo <= 9 * 31) return 'halfYearAgo';
  if (daysAgo <= 15 * 31) return 'yearAgo';
  return 'yearsAgo';
}
