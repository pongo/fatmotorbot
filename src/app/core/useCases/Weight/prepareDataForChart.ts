import queryString from 'querystring';
import { BMIFullResult, SuggestedWeightDiff } from 'src/app/core/useCases/BMI/utils/types';
import { DataForChart, YYYYMMDD } from 'src/app/core/useCases/Weight/types';
import { Kg, MeasuresFromNewestToOldest, MeasuresFromOldestToNewest, TelegramUserId } from 'src/app/shared/types';
import { assert } from 'src/shared/utils/assert';
import nodeUrl from 'url';

export function prepareDataForChart(
  userId: TelegramUserId,
  measures: MeasuresFromNewestToOldest<Kg>,
  bmi: BMIFullResult | undefined,
): DataForChart {
  const data = prepareData(measures);
  const user = prepareUser();
  return { userId, data, user };

  function prepareData(values: MeasuresFromNewestToOldest<Kg>): MeasuresFromOldestToNewest<Kg> {
    return [...values].reverse();
  }

  function prepareUser() {
    if (bmi == null) return undefined;
    return {
      health: {
        min: bmi.healthyRange[0],
        max: bmi.healthyRange[1],
      },
      ideal: {
        min: bmi.ideal.min,
        max: bmi.ideal.max,
      },
      next: getNext(bmi.suggest),
    };

    function getNext(suggest: SuggestedWeightDiff): Kg | undefined {
      if (suggest.alreadyHealthy) return undefined;
      return suggest.toNext?.nextWeight;
    }
  }
}

export function yyymmdd(d: Date): YYYYMMDD {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function createChartQuery({ userId, user, data }: DataForChart): string {
  return `/${userId}.png?d=${getData()}${getUser()}`;

  function getData() {
    return e(data.map(({ date, value }) => `${yyymmdd(date)}_${value}`).join('!'));
  }

  function getUser() {
    if (user == null) return '';
    const h = `&h=${user.health.min}!${user.health.max}`;
    const i = `&i=${user.ideal.min}!${user.ideal.max}`;
    const n = user.next == null ? '' : `&n=${user.next}`;
    return `${h}${i}${n}`;
  }

  function e(text: string) {
    return encodeURIComponent(text);
  }
}

// eslint-disable-next-line max-lines-per-function
export function parseChartQuery(url: string): DataForChart {
  const { pathname, query } = nodeUrl.parse(url);
  const parsed = queryString.parse(query ?? '');

  const userId = parseUserId(pathname ?? '');
  const data = parseData(get('d'));
  const user = parseUser();

  return { userId, data, user };

  function parseUserId(pathname_: string): TelegramUserId {
    const reUserId = /^\/(\d+)\.png$/i;
    if (!reUserId.test(pathname_)) throw new Error(`Invalid pathname: "${pathname_}"`);
    return parseInt(pathname_.replace(reUserId, '$1'), 10) as TelegramUserId;
  }

  function parseData(str: string): MeasuresFromOldestToNewest<Kg> {
    if (str === '') return [];
    return str.split('!').map(part => {
      const [date, value] = part.split('_');
      return { date: new Date(date), value: parseKg(value) };
    });
  }

  function parseUser() {
    const h = get('h', true);
    const i = get('i', true);
    const n = get('n', true);
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

  function parseKg(value: string): Kg {
    const weight = parseFloat(value);
    if (Number.isNaN(weight)) throw Error(`weight (${value}) is NaN`);
    return weight as Kg;
  }

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
