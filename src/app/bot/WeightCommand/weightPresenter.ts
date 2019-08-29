/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* tslint:disable:no-non-null-assertion */
import { differenceInCalendarDays } from 'date-fns';
import { CurrentWeight, WeightAdded } from 'src/app/bot/WeightCommand/WeightUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { DateMark, MeasureDifferenceSummary } from 'src/app/shared/measureDifference';
import { Kg, Measure } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export function weightPresenter(result: Result<CurrentWeight | WeightAdded>, now: Date): string {
  if (result.isErr) return presentError(result.error);
  const data = result.value;
  return data.kind === 'current' ? presentCurrent(data, now) : presentAdd(data);
}

function presentAdd({ weight, diff }: WeightAdded) {
  if (diff == null) {
    return `Твой вес: ${weight} кг.\n\nПервый шаг сделан. Регулярно делай замеры, например, каждую пятницу утром.`;
  }
  return showDiff(weight, diff);
}

function presentError(error: InvalidFormatError | Error) {
  if (error instanceof InvalidFormatError) return 'Какой-какой у тебя вес?';
  return 'Что-то не так с базой данных. Вызывайте техподдержку!';
}

function presentCurrent({ current, diff }: CurrentWeight, now: Date) {
  if (current == null) {
    return `Впервые у меня? Встань на весы и взвесься. Затем добавь вес командой, например:\n\n/weight 88.41`;
  }
  if (diff == null) return firstMeasure(current, now);
  return showDiff(current.value, diff);
}

function showDiff(currentWeight: Kg, diff: MeasureDifferenceSummary<Kg>): string {
  const header = `Твой вес: ${currentWeight} кг.\n\n`;
  const previous = presentDiff(diff);
  return `${header}${previous}`;
}

// eslint-disable-next-line max-lines-per-function
function presentDiff(diff: MeasureDifferenceSummary<Kg>) {
  const dates: [DateMark, string][] = [
    ['today', 'Еще сегодня'],
    ['yesterday', 'Вчера'],
    ['daysAgo', 'Пару дней назад'],
    ['weekAgo', 'Неделю назад'],
    ['twoWeeksAgo', 'Две недели назад'],
    ['monthAgo', 'Месяц назад'],
    ['monthsAgo', 'Пару месяцев назад'],
    ['halfYearAgo', 'Полгода назад'],
    ['yearAgo', 'Год назад'],
    ['yearsAgo', 'Годы назад'],
  ];

  return dates.reduce(reducer, '').trim();

  function reducer(acc: string, [mark, text]: [DateMark, string]): string {
    if (mark === 'future' || mark === 'current' || diff[mark] == null) return acc;
    const weight = diff[mark]!.value;
    const difference = differenceStr(diff[mark]!.difference);
    return `${acc}\n• ${text}: ${weight} ${difference}`.trim();
  }

  function differenceStr(difference: number): string {
    if (difference === 0) return '';
    const fixed = difference.toFixed(2).replace('.00', '');
    const withSign = difference > 0 ? `+${fixed}` : fixed.replace('-', '−');
    return `(${withSign})`;
  }
}

function firstMeasure({ date, value }: Measure<Kg>, now: Date): string {
  const header = `Твой вес: ${value} кг.\n\n`;
  const daysAgo = differenceInCalendarDays(now, date);
  if (daysAgo <= 5) return `${header}Регулярно делай замеры, например, каждую пятницу утром.`;
  if (daysAgo <= 9) return `${header}Прошла неделя с последнего замера, пора взвешиваться!`;
  if (daysAgo <= 7 * 7) return `${header}Несколько недель прошло, сколько ты теперь весишь?`;
  if (daysAgo <= 150) return `${header}И было это пару месяцев назад, сколько же ты теперь весишь?`;
  return `${header}Но было это чертовски давно, рискнешь встать на весы?`;
}
