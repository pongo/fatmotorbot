import { createChartQuery } from 'src/app/core/useCases/Weight/prepareDataForChart';
import {
  CurrentWeight,
  DataForChart,
  WeightAdded,
  WeightAddedErrors,
  WeightCases,
} from 'src/app/core/useCases/Weight/types';
import { DatabaseError } from 'src/app/shared/errors';
import { Result } from 'src/shared/utils/result';
import { urlExists } from 'src/shared/utils/urlExists';

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

export async function getCurrentChartUrl(
  result: Result<CurrentWeight, DatabaseError>,
  chartDomain?: string
): Promise<string | undefined> {
  if (result.isErr) return undefined;
  if (result.value.case !== WeightCases.currentDiff) return undefined;
  return getChartUrl(result.value.chart, chartDomain);
}

export async function getAddChartUrl(
  result: Result<WeightAdded, WeightAddedErrors>,
  chartDomain?: string
): Promise<string | undefined> {
  if (result.isErr) return undefined;
  if (result.value.case !== WeightCases.addDiff) return undefined;
  return getChartUrl(result.value.chart, chartDomain);
}
