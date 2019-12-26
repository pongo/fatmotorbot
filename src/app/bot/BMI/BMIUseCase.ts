import { SlonikError } from 'slonik';
import { calcBMIResult } from 'src/app/bot/BMI/calcBMIResult';
import { BMIResult } from 'src/app/bot/BMI/types';
import { IInfoUseCaseGet } from 'src/app/bot/InfoCommand/InfoUseCase';
import { Kg, TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export type BMIResultOrError = Result<BMIResult, SlonikError>;

export interface IBMIUseCase {
  get(userId: TelegramUserId, weight: Kg): Promise<BMIResultOrError>;
}

export class BMIUseCase implements IBMIUseCase {
  constructor(private readonly infoUseCase: IInfoUseCaseGet) {}

  async get(userId: TelegramUserId, weight: Kg): Promise<BMIResultOrError> {
    const infoResult = await this.infoUseCase.get(userId);
    if (infoResult.isErr) return infoResult;

    if (infoResult.value.case === 'get:none') return Result.ok({ case: 'need-user-info' });

    const result = calcBMIResult(weight, infoResult.value.data);
    return Result.ok(result);
  }
}
