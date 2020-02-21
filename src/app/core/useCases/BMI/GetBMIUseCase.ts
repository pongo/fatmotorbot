import { UserInfo } from 'src/app/core/repositories/InfoRepository';
import { calcBMI } from 'src/app/core/useCases/BMI/utils/BMI';
import { getBMICategory, getBMICategoryName, getHealthyRange } from 'src/app/core/useCases/BMI/utils/BMICategory';
import { BMICategoryName, SuggestedWeightDiff } from 'src/app/core/useCases/BMI/utils/types';
import { IInfoUseCaseGet } from 'src/app/core/useCases/Info/types';
import { DatabaseError } from 'src/app/shared/errors';
import { calcIdealWeight, IdealWeight } from 'src/app/shared/IdealWeight';
import { BMI, Cm, Gender, Kg, TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export type BMIResult =
  | { case: 'need-user-info' }
  | {
      case: 'bmi';
      bmi: BMI;
      categoryName: BMICategoryName;
      healthyRange: [Kg, Kg];
      suggest: SuggestedWeightDiff;
      ideal: IdealWeight;
    };

export type BMIResultOrError = Result<BMIResult, DatabaseError>;

export interface IGetBMIUseCase {
  get(userId: TelegramUserId, weight: Kg): Promise<BMIResultOrError>;
}

export class GetBMIUseCase implements IGetBMIUseCase {
  constructor(private readonly infoUseCase: IInfoUseCaseGet) {}

  async get(userId: TelegramUserId, weight: Kg): Promise<BMIResultOrError> {
    const infoResult = await this.infoUseCase.get(userId);
    if (infoResult.isErr) return infoResult;

    if (infoResult.value.case === 'get:no-user-info') return Result.ok({ case: 'need-user-info' });

    const result = calcBMIResult(weight, infoResult.value.data);
    return Result.ok(result);
  }
}

export function getSuggestedWeightDiff(gender: Gender, height: Cm, weight: Kg): SuggestedWeightDiff {
  const bmi = calcBMI(height, weight);
  const category = getBMICategory(gender, bmi);
  return category.getSuggest(gender, height, weight);
}

function calcBMIResult(weight: Kg, { gender, height }: UserInfo): BMIResult {
  const bmi = calcBMI(height, weight);
  return {
    case: 'bmi',
    bmi,
    categoryName: getBMICategoryName(gender, bmi),
    healthyRange: getHealthyRange(gender, height),
    suggest: getSuggestedWeightDiff(gender, height, weight),
    ideal: calcIdealWeight(height, gender),
  };
}
