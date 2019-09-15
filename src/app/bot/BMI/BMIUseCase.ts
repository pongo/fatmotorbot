import { SlonikError } from 'slonik';
import { calcBMI, getBMICategoryName, getHealthyRange, getSuggestedWeightDiff } from 'src/app/bot/BMI/BMI';
import { BMICategoryName, SuggestedWeightDiff } from 'src/app/bot/BMI/BMICategory';
import { calcIdealWeight } from 'src/app/bot/BMI/IdealWeight';
import { IInfoUseCaseGet } from 'src/app/bot/InfoCommand/InfoUseCase';
import { BMI, Kg, TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export type BMIResultOrError = Result<BMIResult, SlonikError>;

export type BMIResult =
  | { case: 'need-user-info' }
  | {
      case: 'bmi';
      bmi: BMI;
      categoryName: BMICategoryName;
      healthyRange: [Kg, Kg];
      suggest: SuggestedWeightDiff;
      ideal: Kg;
    };

export interface IBMIUseCase {
  get(userId: TelegramUserId, weight: Kg): Promise<BMIResultOrError>;
}

export class BMIUseCase implements IBMIUseCase {
  constructor(private readonly infoUseCase: IInfoUseCaseGet) {}

  async get(userId: TelegramUserId, weight: Kg): Promise<BMIResultOrError> {
    const infoResult = await this.infoUseCase.get(userId);
    if (infoResult.isErr) return infoResult;

    if (infoResult.value.case === 'get:none') return Result.ok({ case: 'need-user-info' });

    const { gender, height } = infoResult.value.data;
    const bmi = calcBMI(height, weight);
    const result: BMIResult = {
      case: 'bmi',
      bmi,
      categoryName: getBMICategoryName(gender, bmi),
      healthyRange: getHealthyRange(gender, height),
      suggest: getSuggestedWeightDiff(gender, height, weight),
      ideal: calcIdealWeight(height, gender),
    };
    return Result.ok(result);
  }
}
