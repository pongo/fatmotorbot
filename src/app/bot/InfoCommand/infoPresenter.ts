import { SlonikError } from 'slonik';
import { InfoAddErrors, InfoGetResult, InfoSetResult } from 'src/app/bot/InfoCommand/InfoUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { Result } from 'src/shared/utils/result';
import { UserInfo } from './InfoRepository';

export function infoPresenter(result: Result<InfoGetResult | InfoSetResult, InfoAddErrors>) {
  if (result.isErr) return presentError(result.error);
  if (result.value.case === 'get:none') return presentNoData();
  if (result.value.case === 'get') return presentUserData(result.value.data);
  return presentSetData(result.value.data);
}

function presentNoData() {
  return `
Укажи свои данные командой: /info пол рост, где:
• пол — м или ж
• рост в см — 185

Пример: /info ж 164
`.trim();
}

function presentError(error: InvalidFormatError | SlonikError | Error) {
  if (error instanceof InvalidFormatError) return 'Не могу разобрать твои каракули. Пиши точно как я указал';
  if (error instanceof SlonikError) return 'Что-то не так с базой данных. Вызывайте техподдержку!';
  return 'Ошибочная ошибка';
}

function presentUserData(data: UserInfo) {
  const gender = data.gender === 'female' ? 'Женщина' : 'Мужчина';
  return `${gender}, ${data.height} см`;
}

function presentSetData(data: UserInfo) {
  return `Сохранил твои данные: ${presentUserData(data).toLowerCase()}`;
}