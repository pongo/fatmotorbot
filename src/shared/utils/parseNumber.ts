import Big from 'big.js';

export function parseNumber(str: string): number | null {
  const prepared = str
    .replace(',', '.') // формат с запятой вместо точки "70,23"
    .replace(/[−‒–—―]/g, '-'); // символы типа дефиса
  const reFloat = /-?\d+(\.\d+)?/;
  const found = reFloat.exec(prepared); // используем exec чтобы получить только первое совпадение
  if (found == null) return null;

  const num = found[0];
  return roundToTwo(parseFloat(num));
}

/**
 * Округляет с точностью 2 знака после запятой
 */
export function roundToTwo(num: number | Big, dp = 2): number {
  // prettier-ignore
  return parseFloat(Big(num).toFixed(dp));
}

// Вычитание: current - other
export function minus<T extends number>(current: T, other: T): T {
  return roundToTwo(Big(current).minus(other)) as T;
}
