import { differenceInCalendarDays } from 'date-fns';
import { SlonikError } from 'slonik';
import { bmiPresenter } from 'src/app/core/BMI/bmiPresenter';
import {
  CurrentWeight,
  CurrentWeightDiff,
  CurrentWeightFirst,
  WeightAdded,
  WeightAddedDiff,
  WeightAddedFirst,
  WeightCases,
} from 'src/app/core/Weight/WeightUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { DateMark, getDateMark, MeasureDifferenceSummary } from 'src/app/shared/measureDifference';
import { Kg, Measure } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export function weightPresenter(result: Result<CurrentWeight | WeightAdded>, now: Date): string {
  if (result.isErr) return presentError(result.error);
  const data = result.value;

  switch (data.case) {
    case WeightCases.addFirst:
      return presentAddFirst(data);
    case WeightCases.addDiff:
      return presentAddDiff(data);
    case WeightCases.currentEmpty:
      return presentCurrentEmpty();
    case WeightCases.currentFirst:
      return presentCurrentFirst(data, now);
    case WeightCases.currentDiff:
      return presentCurrentDiff(data, now);
    default:
      return 'Ошибочный кейс';
  }
}

function presentError(error: InvalidFormatError | SlonikError | Error) {
  if (error instanceof InvalidFormatError) return 'Какой-какой у тебя вес?';
  if (error instanceof SlonikError) return 'Что-то не так с базой данных. Вызывайте техподдержку!';
  return 'Ошибочная ошибка';
}

function presentAddFirst({ weight, bmi }: WeightAddedFirst) {
  const header = getHeader(weight);
  return `${header}Первый шаг сделан. Регулярно делай замеры, например, каждую пятницу утром.\n\n${bmiPresenter(bmi)}`;
}

function presentAddDiff({ diff, weight, bmi }: WeightAddedDiff) {
  const previous = presentDiff(diff);
  return `${getHeader(weight)}${previous}\n\n${bmiPresenter(bmi)}`;
}

function presentCurrentEmpty() {
  return `Впервые у меня? Встань на весы и взвесься. Затем добавь вес командой, например:\n\n/weight 88.41`;
}

function presentCurrentFirst({ current, bmi }: CurrentWeightFirst, now: Date): string {
  const { date, value } = current;
  const note = getNoteByDaysAgo(differenceInCalendarDays(now, date));
  return `${getHeader(value)}${note}\n\n${bmiPresenter(bmi)}`;

  function getNoteByDaysAgo(daysAgo: number) {
    if (daysAgo <= 5) return 'Регулярно делай замеры, например, каждую пятницу утром.';
    if (daysAgo <= 9) return 'Прошла неделя с последнего замера, пора взвешиваться!';
    if (daysAgo <= 7 * 7) return 'Несколько недель прошло, сколько ты теперь весишь?';
    if (daysAgo <= 150) return 'И было это пару месяцев назад, сколько же ты теперь весишь?';
    return 'Но было это чертовски давно, рискнешь встать на весы?';
  }
}

function presentCurrentDiff({ current, diff, bmi }: CurrentWeightDiff, now: Date): string {
  const header = headerRelativeDate(current);
  const previous = presentDiff(diff);
  return `${header}${previous}\n\n${bmiPresenter(bmi)}`;

  function headerRelativeDate({ date, value }: Measure<Kg>) {
    const markToHeader: { [key in DateMark]: string } = {
      current: 'Твой вес',
      today: 'Твой вес',
      yesterday: 'Вес вчера',
      daysAgo: 'Вес пару дней назад',
      weekAgo: 'Вес неделю назад',
      twoWeeksAgo: 'Вес две недели назад',
      monthAgo: 'Вес месяц назад',
      monthsAgo: 'Вес пару месяцев назад',
      halfYearAgo: 'Вес полгода назад',
      yearAgo: 'Вес год назад',
      yearsAgo: 'Вес годы назад',
      future: 'Ты будешь весить',
    };

    const mark = getDateMark(now, date);
    return `${markToHeader[mark]}: ${value} кг.\n\n`;
  }
}

function presentDiff(diff: MeasureDifferenceSummary<Kg>) {
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

function getHeader(weight: Kg) {
  return `Твой вес: ${weight} кг.\n\n`;
}
