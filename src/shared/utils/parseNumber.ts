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
 * https://stackoverflow.com/a/41716722/136559
 */
export function roundToTwo(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
