import { bmiPresenter } from 'src/app/bot/presenters/bmiPresenter';
import { presentUserData } from 'src/app/bot/InfoCommand/presenters/shared';
import { presentDatabaseError } from 'src/app/bot/presenters/shared';
import { UserInfo } from 'src/app/core/repositories/InfoRepository';
import { BMIResult } from 'src/app/core/useCases/BMI/utils/types';
import { InfoAddErrors, InfoSetResult } from 'src/app/core/useCases/Info/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { Result } from 'src/shared/utils/result';

export function presentSetInfo(result: Result<InfoSetResult, InfoAddErrors>): string {
  if (result.isErr) return presentError(result.error);
  return presentSetData(result.value.data, result.value.bmi);
}

function presentError(error: InvalidFormatError | DatabaseError) {
  if (error instanceof InvalidFormatError) return 'Не могу разобрать твои каракули. Пиши точно как я указал';
  return presentDatabaseError();
}

function presentSetData(data: UserInfo, bmi: null | BMIResult) {
  const bmiText = bmi == null ? '' : `.\n\n${bmiPresenter(Result.ok(bmi))}`;
  return `Сохранил твои данные: ${presentUserData(data).toLowerCase()}${bmiText}`;
}
