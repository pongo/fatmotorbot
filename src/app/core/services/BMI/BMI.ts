import { IInfoRepositoryGet, UserInfo } from 'src/app/core/repositories/InfoRepository';
import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import { getBMICategory, getBMICategoryName, getHealthyRange } from 'src/app/core/services/BMI/utils/BMICategory';
import { BMIResult, BMIResultOrError, SuggestedWeightDiff } from 'src/app/core/services/BMI/utils/types';
import { calcIdealWeight } from 'src/app/core/services/IdealWeight';
import { BMI, Cm, Gender, Kg, TelegramUserId } from 'src/app/shared/types';
import { roundToTwo } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

/**
 * Вычисляет ИМТ, используя "новую" формулу.
 * http://people.maths.ox.ac.uk/trefethen/bmi_calc.html
 */
export function calcBMIValue(height: Cm, weight: Kg): BMI {
  const bmi = (weight * 1.3) / calcBMICoeff(height);
  return roundToTwo(bmi) as BMI;
}

export function calcBMICoeff(height: Cm) {
  return (((height / 100) * height) / 100) * Math.sqrt(height / 100);
}

export interface IGetBMIUseCase {
  get(userId: TelegramUserId, data: GetData): Promise<BMIResultOrError>;
}

type GetData = {
  weight?: Kg;
  userInfo?: UserInfo;
};

export class GetBMIUseCase implements IGetBMIUseCase {
  constructor(
    private readonly infoRepository: IInfoRepositoryGet,
    private readonly weightRepository: IWeightRepository,
  ) {}

  async get(userId: TelegramUserId, data: GetData = {}): Promise<BMIResultOrError> {
    const { weight, userInfo } = data;

    if (userInfo == null && weight != null) return calcBMIFromWeight(userId, weight, this.infoRepository);
    if (weight == null && userInfo != null) return calcBMIFromUserInfo(userId, userInfo, this.weightRepository);

    if (weight == null || userInfo == null) throw Error('weight and userInfo should be defined');
    return Result.ok(calcBMI(weight, userInfo));
  }
}

export function getSuggestedWeightDiff(gender: Gender, height: Cm, weight: Kg): SuggestedWeightDiff {
  const bmi = calcBMIValue(height, weight);
  const category = getBMICategory(gender, bmi);
  return category.getSuggest(gender, height, weight);
}

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
