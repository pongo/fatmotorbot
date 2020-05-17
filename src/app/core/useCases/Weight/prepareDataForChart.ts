import { BMIFullResult, SuggestedWeightDiff } from 'src/app/core/services/BMI/utils/types';
import { DataForChart, YYYYMMDD } from 'src/app/core/useCases/Weight/types';
import { Kg, MeasuresFromNewestToOldest, MeasuresFromOldestToNewest, TelegramUserId } from 'src/app/shared/types';

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
