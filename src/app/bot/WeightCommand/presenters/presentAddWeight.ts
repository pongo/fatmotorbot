import { bmiPresenter } from 'src/app/bot/presenters/bmiPresenter';
import { presentDatabaseError } from 'src/app/bot/presenters/shared';
import { chartImage, getChartUrl, getHeader, presentDiff } from 'src/app/bot/WeightCommand/presenters/shared';
import {
  WeightAdded,
  WeightAddedDiff,
  WeightAddedErrors,
  WeightAddedFirst,
  WeightCases,
} from 'src/app/core/useCases/Weight/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { Result } from 'src/shared/utils/result';

export function presentAddWeight(result: Result<WeightAdded, WeightAddedErrors>, chartUrl?: string): string {
  if (result.isErr) return presentError(result.error);

  const data = result.value;
  if (data.case === WeightCases.addFirst) return presentAddFirst(data);
  return presentAddDiff(data, chartUrl);
}

export async function getAddChartUrl(
  result: Result<WeightAdded, WeightAddedErrors>,
  chartDomain?: string,
): Promise<string | undefined> {
  if (result.isErr) return undefined;
  if (result.value.case !== WeightCases.addDiff) return undefined;
  return getChartUrl(result.value.chart, chartDomain);
}

function presentError(error: InvalidFormatError | DatabaseError) {
  if (error instanceof InvalidFormatError) return 'Какой-какой у тебя вес?';
  return presentDatabaseError();
}

function presentAddFirst({ weight, bmi }: WeightAddedFirst) {
  const header = getHeader(weight);
  return `${header}Первый шаг сделан. Регулярно делай замеры, например, каждую пятницу утром.\n\n${bmiPresenter(bmi)}`;
}

function presentAddDiff({ diff, weight, bmi }: WeightAddedDiff, chartUrl?: string) {
  const previous = presentDiff(diff);
  return `${getHeader(weight)}${previous}\n\n${bmiPresenter(bmi)}${chartImage(chartUrl)}`;
}
