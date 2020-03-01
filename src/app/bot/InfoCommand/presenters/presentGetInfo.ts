import { presentUserData } from 'src/app/bot/InfoCommand/presenters/shared';
import { presentDatabaseError } from 'src/app/bot/presenters/shared';
import { InfoGetResult } from 'src/app/core/useCases/Info/types';
import { DatabaseError } from 'src/app/shared/errors';
import { Result } from 'src/shared/utils/result';

export function presentGetInfo(result: Result<InfoGetResult, DatabaseError>): string {
  if (result.isErr) return presentDatabaseError();
  if (result.value.case === 'get:no-user-info') return presentNoData();
  return presentUserData(result.value.data);
}

function presentNoData() {
  return `
Укажи свои данные командой: /info пол рост, где:
• пол — м или ж
• рост в см — 185

Пример: /info ж 164
`.trim();
}
