import nodeUrl from 'url';
import queryString from 'querystring';
import { DataForChart } from 'src/app/core/useCases/Weight/types';
import { Kg, MeasuresFromOldestToNewest, TelegramUserId } from 'src/app/shared/types';
import { assert } from 'src/shared/utils/assert';

export function parseChartQuery(url: string): DataForChart {
  const { pathname, query } = nodeUrl.parse(url);
  const parsed = queryString.parse(query ?? '');

  const userId = parseUserId(pathname ?? '');
  const data = parseData(get('d'));
  const user = parseUser(get('h', true), get('i', true), get('n', true));

  return { userId, data, user };

  function get(key: string): string;
  function get(key: string, optional: boolean): string | undefined;
  function get(key: string, optional = false): string | undefined {
    const value = parsed[key];
    if (optional && value == null) return undefined;
    assert(value != null, `"${key}" should be defined`);
    assert(!Array.isArray(value), `"${key}" should not be an array`);
    return value;
  }
}

function parseData(str: string): MeasuresFromOldestToNewest<Kg> {
  if (str === '') throw Error('"d" should not be empty');
  return str.split('!').map(part => {
    const [date, value] = part.split('_');
    return { date: new Date(date), value: parseKg(value) };
  });
}

function parseKg(value: string): Kg {
  const weight = parseFloat(value);
  if (Number.isNaN(weight)) throw Error(`weight (${value}) is NaN`);
  return weight as Kg;
}

function parseUserId(pathname: string): TelegramUserId {
  const reUserId = /^\/(\d+)\.png$/i;
  if (!reUserId.test(pathname)) throw new Error(`Invalid pathname: "${pathname}"`);
  return parseInt(pathname.replace(reUserId, '$1'), 10) as TelegramUserId;
}

function parseUser(h?: string, i?: string, n?: string) {
  if (h == null && i == null) return undefined;
  assert(h != null, '"h" should be defined');
  assert(i != null, '"i" should be defined');

  const health = parseMinMax(h);
  const ideal = parseMinMax(i);
  const next = n == null ? undefined : parseKg(n);

  return { health, ideal, next };

  function parseMinMax(str: string): { min: Kg; max: Kg } {
    const [min, max] = str.split('!');
    return { min: parseKg(min), max: parseKg(max) };
  }
}
