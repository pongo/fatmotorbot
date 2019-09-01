import { differenceInCalendarDays } from 'date-fns';
import { CurrentWeight, WeightAdded } from 'src/app/bot/WeightCommand/WeightUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { DateMark, getDateMark, MeasureDifferenceSummary } from 'src/app/shared/measureDifference';
import { Kg, Measure } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export function weightPresenter(result: Result<CurrentWeight | WeightAdded>, now: Date): string {
  if (result.isErr) return presentError(result.error);
  const data = result.value;
  return data.kind === 'current' ? presentCurrent(data, now) : presentAdd(data);
}

function presentAdd({ weight, diff }: WeightAdded) {
  const header = `Твой вес: ${weight} кг.\n\n`;
  if (diff == null) {
    return `${header}Первый шаг сделан. Регулярно делай замеры, например, каждую пятницу утром.`;
  }
  const previous = presentDiff(diff);
  return `${header}${previous}`;
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
  return presentCurrentDiff(current, diff, now);
}

function presentCurrentDiff(current: Measure<Kg>, diff: MeasureDifferenceSummary<Kg>, now: Date): string {
  const header = headerRelativeDate(current, now);
  const previous = presentDiff(diff);
  return `${header}${previous}`;
}

function headerRelativeDate({ date, value }: Measure<Kg>, now: Date) {
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

// eslint-disable-next-line max-lines-per-function
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

function firstMeasure({ date, value }: Measure<Kg>, now: Date): string {
  const note = getNoteByDaysAgo(differenceInCalendarDays(now, date));
  return `Твой вес: ${value} кг.\n\n${note}`;

  function getNoteByDaysAgo(daysAgo: number) {
    if (daysAgo <= 5) return 'Регулярно делай замеры, например, каждую пятницу утром.';
    if (daysAgo <= 9) return 'Прошла неделя с последнего замера, пора взвешиваться!';
    if (daysAgo <= 7 * 7) return 'Несколько недель прошло, сколько ты теперь весишь?';
    if (daysAgo <= 150) return 'И было это пару месяцев назад, сколько же ты теперь весишь?';
    return 'Но было это чертовски давно, рискнешь встать на весы?';
  }
}
