import { differenceInCalendarDays } from 'date-fns';
import { bmiPresenter } from 'src/app/bot/presenters/bmiPresenter';
import { presentDatabaseError } from 'src/app/bot/presenters/shared';
import { chartImage, getHeader, presentDiff } from 'src/app/bot/WeightCommand/presenters/shared';
import { CurrentWeight, CurrentWeightDiff, CurrentWeightFirst, WeightCases } from 'src/app/core/useCases/Weight/types';
import { DatabaseError } from 'src/app/shared/errors';
import { DateMark, getDateMark } from 'src/app/shared/measureDifference';
import { Kg, Measure } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export function presentCurrentWeight(
  result: Result<CurrentWeight, DatabaseError>,
  now: Date,
  chartDomain?: string,
): string {
  if (result.isErr) return presentDatabaseError();

  const data = result.value;
  switch (data.case) {
    case WeightCases.currentEmpty:
      return presentCurrentEmpty();
    case WeightCases.currentFirst:
      return presentCurrentFirst(data, now);
    default:
      return presentCurrentDiff(data, now, chartDomain);
  }
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

function presentCurrentDiff({ current, diff, bmi, chart }: CurrentWeightDiff, now: Date, chartDomain?: string): string {
  const header = headerRelativeDate(current);
  const previous = presentDiff(diff);
  return `${header}${previous}\n\n${bmiPresenter(bmi)}${chartImage(chart, chartDomain)}`;

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
