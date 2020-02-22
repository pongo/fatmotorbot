import { UserInfo } from 'src/app/core/repositories/InfoRepository';
import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import { calcBMI } from 'src/app/core/useCases/BMI/utils/BMI';
import { getBMICategory, getBMICategoryName, getHealthyRange } from 'src/app/core/useCases/BMI/utils/BMICategory';
import { BMIResult, BMIResultOrError, SuggestedWeightDiff } from 'src/app/core/useCases/BMI/utils/types';
import { IInfoUseCaseGet } from 'src/app/core/useCases/Info/types';
import { calcIdealWeight } from 'src/app/shared/IdealWeight';
import { Cm, Gender, Kg, TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export interface IGetBMIUseCase {
  get(userId: TelegramUserId, data: GetData): Promise<BMIResultOrError>;
}

type GetData = {
  weight?: Kg;
  userInfo?: UserInfo;
};

export class GetBMIUseCase implements IGetBMIUseCase {
  constructor(private readonly infoUseCase: IInfoUseCaseGet, private readonly weightRepository: IWeightRepository) {}

  async get(userId: TelegramUserId, data: GetData = {}): Promise<BMIResultOrError> {
    let weight: Kg;
    let userInfo: UserInfo;

    if (data.userInfo == null) {
      const infoResult = await this.infoUseCase.get(userId);
      if (infoResult.isErr) return infoResult;
      if (infoResult.value.case === 'get:no-user-info') return Result.ok({ case: 'need-user-info' });
      userInfo = infoResult.value.data;
    } else {
      userInfo = data.userInfo;
    }

    if (data.weight == null) {
      const weightResult = await this.weightRepository.getCurrent(userId);
      if (weightResult.isErr) return weightResult;
      if (weightResult.value == null) return Result.ok({ case: 'need-user-weight' });
      weight = weightResult.value;
    } else {
      weight = data.weight;
    }

    return Result.ok(calcBMIResult(weight, userInfo));
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
