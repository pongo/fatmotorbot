export function parseNumber(str: string): number | null {
  const prepared = str
    .replace(',', '.') // формат с запятой вместо точки "70,23"
    .replace(/[−‒–—―]/g, '-'); // символы типа дефиса
  const reFloat = /-?\d+(\.\d+)?/;
  const found = reFloat.exec(prepared); // используем exec чтобы получить только первое совпадение
  if (found == null) return null;

  const num = found[0];
  return Math.round(parseFloat(num) * 100) / 100; // 2 знака после запятой
}
