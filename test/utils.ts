import { MeasuresFromNewestToOldest } from 'src/app/bot/WeightCommand/WeightRepository';
import { Measure, TelegramUserId } from 'src/app/shared/types';

/**
 * Возвращает новый отсортированный массив.
 */
export function sortMeasuresFromNewestToOldest<T extends number>(array: Measure<T>[]): MeasuresFromNewestToOldest<T> {
  return [...array].sort((a, b) => +b.date - +a.date); // плюсы нужны, чтобы typescript не ругался
}

export const sortM = sortMeasuresFromNewestToOldest;

export const u = (id: number) => id as TelegramUserId;

export const m = <T extends number>(date: Date, value: T): Measure<T> => ({ date, value });
