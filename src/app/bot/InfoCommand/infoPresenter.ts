import { UserInfo } from 'src/app/core/repositories/InfoRepository';
import { bmiPresenter } from 'src/app/bot/bmiPresenter';
import { BMIResult } from 'src/app/core/useCases/BMI/GetBMIUseCase';
import { InfoAddErrors, InfoGetResult, InfoSetResult } from 'src/app/core/useCases/Info/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { Result } from 'src/shared/utils/result';

export function infoPresenter(result: Result<InfoGetResult | InfoSetResult, InfoAddErrors>) {
  if (result.isErr) return presentError(result.error);
  if (result.value.case === 'get:no-user-info') return presentNoData();
  if (result.value.case === 'get') return presentUserData(result.value.data);
  return presentSetData(result.value.data, result.value.bmi);
}

function presentNoData() {
  return `
Укажи свои данные командой: /info пол рост, где:
• пол — м или ж
• рост в см — 185

Пример: /info ж 164
`.trim();
}

function presentError(error: InvalidFormatError | DatabaseError | Error) {
  if (error instanceof InvalidFormatError) return 'Не могу разобрать твои каракули. Пиши точно как я указал';
  if (error instanceof DatabaseError) return 'Что-то не так с базой данных. Вызывайте техподдержку!';
  return 'Ошибочная ошибка';
}

function presentUserData(data: UserInfo) {
  const gender = data.gender === 'female' ? 'Женщина' : 'Мужчина';
  return `${gender}, ${data.height} см`;
}

function presentSetData(data: UserInfo, bmi: null | BMIResult) {
  const bmiText = bmi == null ? '' : `.\n\n${bmiPresenter(Result.ok(bmi))}`;
  return `Сохранил твои данные: ${presentUserData(data).toLowerCase()}${bmiText}`;
}
