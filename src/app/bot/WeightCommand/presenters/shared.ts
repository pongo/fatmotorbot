import { createChartQuery } from 'src/app/core/useCases/Weight/prepareDataForChart';
import { DataForChart } from 'src/app/core/useCases/Weight/types';
import { DateMark, MeasureDifferenceSummary } from 'src/app/shared/measureDifference';
import { Kg } from 'src/app/shared/types';
import { urlExists } from 'src/shared/utils/urlExists';

export function getHeader(weight: Kg): string {
  return `Твой вес: ${weight} кг.\n\n`;
}

export function presentDiff(diff: MeasureDifferenceSummary<Kg>): string {
  let firstAgoLabelAdded = false;
  const dates: [DateMark, string][] = [
    ['today', 'Сегодня ранее'],
    ['yesterday', 'Вчера'],
    ['daysAgo', 'Пару дней :ago:'],
    ['weekAgo', 'Неделю :ago:'],
    ['twoWeeksAgo', 'Две недели :ago:'],
    ['monthAgo', 'Месяц :ago:'],
    ['monthsAgo', 'Пару месяцев :ago:'],
    ['halfYearAgo', 'Полгода :ago:'],
    ['yearAgo', 'Год :ago:'],
    ['yearsAgo', 'Годы назад'],
  ];
  return dates.reduce(reducer, '').trim();

  function reducer(acc: string, [mark, text]: [DateMark, string]): string {
    if (mark === 'future' || mark === 'current') return acc;
    const measure = diff[mark];
    if (measure == null) return acc;

    const weight = measure.value;
    const difference = differenceStr(measure.difference);
    return `${acc}\n• ${ago(text)}: ${weight} ${difference}`.trim();
  }

  function ago(text: string) {
    if (text.includes(':ago:') && !firstAgoLabelAdded) {
      firstAgoLabelAdded = true;
      return text.replace(':ago:', 'назад');
    }
    return text.replace(':ago:', '').trim();
  }

  function differenceStr(difference: number): string {
    if (difference === 0) return '';
    const fixed = difference.toFixed(2).replace('.00', '');
    const withSign = difference > 0 ? `+${fixed}` : fixed.replace('-', '−');
    return `(${withSign})`;
  }
}

export function chartImage(chartUrl?: string): string {
  if (chartUrl == null) return '';
  return `<a href="${chartUrl}">&#8205;</a>`;
}

export function createChartUrl(chart?: DataForChart, chartDomain?: string): undefined | string {
  if (chart == null) return undefined;
  if (chartDomain == null || chartDomain === '') return undefined;

  const chartQuery = createChartQuery(chart);
  return `https://${chartDomain}${chartQuery}`;
}

export async function getChartUrl(chart?: DataForChart, chartDomain?: string): Promise<undefined | string> {
  const url = createChartUrl(chart, chartDomain);
  return url == null ? undefined : urlExists(url);
}