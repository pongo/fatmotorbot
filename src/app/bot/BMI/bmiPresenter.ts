import { SlonikError } from 'slonik';
import { BMICategoryName, SuggestedNextDiff } from 'src/app/bot/BMI/BMI';
import { BMIResult, BMIResultOrError } from 'src/app/bot/BMI/BMIUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { Kg } from 'src/app/shared/types';

export function bmiPresenter(result: BMIResultOrError): string {
  if (result.isErr) return presentError(result.error);
  return presentBMI(result.value);
}

function presentError(error: InvalidFormatError | SlonikError | Error) {
  if (error instanceof SlonikError) return 'ИМТ: <i>ошибка в бд</i>';
  return 'ИМТ: Ошибочная ошибка';
}

const interpretCategory: { [name in BMICategoryName]: string } = {
  'Very severely underweight': 'у тебя выраженный дефицит веса, скорее ко врачу!',
  'Severely underweight': 'у тебя дефицит веса.',
  Underweight: 'у тебя неопасный дефицит веса.',
  Normal: 'у тебя здоровый вес 💪.',
  Overweight: 'у тебя избыточный вес.',
  'Obese I': 'у тебя ожирение I степени.',
  'Obese II': 'у тебя ожирение II степени.',
  'Obese III': 'у тебя ожирение III степени.',
  'Obese IV': 'у тебя ожирение IV степени.',
  'Obese V': 'у тебя ожирение V степени.',
  'Obese VI+': 'у тебя ожирение VI степени или больше.',
};

const interpretNextCategory: { [name in BMICategoryName]: string } = {
  'Very severely underweight': '❌',
  'Severely underweight': '«обычный» дефицит веса',
  Underweight: 'неопасный дефицит',
  Normal: '❌',
  Overweight: '«всего лишь» избыточный вес',
  'Obese I': 'I степень',
  'Obese II': 'II степень',
  'Obese III': 'II степень',
  'Obese IV': 'IV степень',
  'Obese V': 'V степень',
  'Obese VI+': '❌',
};

function presentBMI(data: BMIResult): string {
  if (data.case === 'need-user-info') return 'Для расчета ИМТ не хватает данных. Укажи их при помощи /info';
  const { bmi, healthyRange, categoryName, ideal, suggest } = data;
  return `ИМТ: ${bmi} — ${interpretCategory[categoryName]} ${healthy()}. А твой идеальный вес: ${ideal} кг.`;

  function healthy() {
    const [hLower, hUpper] = healthyRange;
    const range = `от ${hLower} до ${hUpper} кг`;
    if (suggest.alreadyHealthy) return `Твоя граница здорового веса: ${range}`;

    const { toHealthy, toNext } = suggest;
    return `Тебе нужно ${diffKg(toHealthy)} до здорового веса, который для тебя ${range}${next(toNext)}`;
  }

  function next(toNext: SuggestedNextDiff | null) {
    if (toNext == null) return '';
    const nextCategory = interpretNextCategory[toNext.categoryName];
    return `. Первым шагом тебе нужно ${diffKg(toNext.diff)} — тогда у тебя будет ${nextCategory}`;
  }

  function diffKg(to: Kg) {
    const action = to >= 0 ? 'набрать' : 'сбросить';
    return `${action} ${Math.abs(to)} кг`;
  }
}
