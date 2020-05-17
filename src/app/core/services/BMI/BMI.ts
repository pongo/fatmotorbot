import { IInfoRepositoryGet, UserInfo } from 'src/app/core/repositories/InfoRepository';
import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import {
  getBMICategoryName,
  getHealthyRange,
  getSuggestedWeightDiff,
} from 'src/app/core/services/BMI/utils/BMICategory';
import { BMIResult, BMIResultOrError } from 'src/app/core/services/BMI/utils/types';
import { calcBMIValue } from 'src/app/core/services/BMI/utils/utils';
import { calcIdealWeight } from 'src/app/core/services/IdealWeight';
import { Kg, TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export function calcBMI(weight: Kg, { gender, height }: UserInfo): BMIResult {
  const bmi = calcBMIValue(height, weight);
  return {
    case: 'bmi',
    bmi,
    categoryName: getBMICategoryName(gender, bmi),
    healthyRange: getHealthyRange(gender, height),
    suggest: getSuggestedWeightDiff(gender, height, weight),
    ideal: calcIdealWeight(height, gender),
  };
}

export async function calcBMIFromWeight(
  userId: TelegramUserId,
  weight: Kg,
  infoRepository: IInfoRepositoryGet,
): Promise<BMIResultOrError> {
  const infoResult = await infoRepository.get(userId);
  if (infoResult.isErr) return infoResult;
  if (infoResult.value == null) return Result.ok({ case: 'need-user-info' });

  const userInfo = infoResult.value;
  return Result.ok(calcBMI(weight, userInfo));
}

export async function calcBMIFromUserInfo(
  userId: TelegramUserId,
  userInfo: UserInfo,
  weightRepository: IWeightRepository,
): Promise<BMIResultOrError> {
  const weightResult = await weightRepository.getCurrent(userId);
  if (weightResult.isErr) return weightResult;
  if (weightResult.value == null) return Result.ok({ case: 'need-user-weight' });

  const weight = weightResult.value;
  return Result.ok(calcBMI(weight, userInfo));
}
