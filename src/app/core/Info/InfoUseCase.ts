import { BMIUseCase } from 'src/app/core/BMI/BMIUseCase';
import {
  IInfoRepository,
  IInfoUseCaseGet,
  InfoAddErrors,
  InfoGetResult,
  InfoSetResult,
  UserInfo,
} from 'src/app/core/Info/types';
import { IWeightRepository, WeightCases } from 'src/app/core/Weight/types';
import { WeightUseCase } from 'src/app/core/Weight/WeightUseCase';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { Cm, Gender, TelegramUserId } from 'src/app/shared/types';
import { parseNumber } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

interface IInfoUseCaseSet {
  set(userId: TelegramUserId, args: string[]): Promise<Result<InfoSetResult, InfoAddErrors>>;
}

interface IInfoUseCase extends IInfoUseCaseGet, IInfoUseCaseSet {}

export class InfoUseCase implements IInfoUseCase {
  private readonly weightUseCase: WeightUseCase;

  constructor(
    private readonly infoRepository: IInfoRepository,
    readonly weightRepository: IWeightRepository,
  ) {
    const bmiUseCase = new BMIUseCase(this);
    this.weightUseCase = new WeightUseCase(weightRepository, bmiUseCase);
  }

  async get(userId: TelegramUserId): Promise<Result<InfoGetResult, DatabaseError>> {
    console.debug(`InfoUseCase.get(${userId});`);

    const result = await this.infoRepository.get(userId);
    if (result.isErr) return result;

    if (result.value == null) return Result.ok({ case: 'get:no-user-info' });
    return Result.ok({ case: 'get', data: result.value });
  }

  async set(userId: TelegramUserId, args: string[]): Promise<Result<InfoSetResult, InfoAddErrors>> {
    console.log(`InfoUseCase.add(${userId}, [${args}]);`);

    const data = validateData(args);
    if (data == null) return Result.err(new InvalidFormatError());

    const addResult = await this.infoRepository.set(userId, data);
    if (addResult.isErr) return addResult;

    const weightResult = await this.weightUseCase.getCurrent(userId, new Date());
    const bmi = getBmiFromResult();

    return Result.ok({ case: 'set', data, bmi });

    function getBmiFromResult() {
      if (weightResult.isErr) return null;
      if (weightResult.value.case === WeightCases.currentEmpty) return null;

      const bmiResult = weightResult.value.bmi;
      if (bmiResult.isErr) return null;
      return bmiResult.value;
    }
  }
}

export function validateData(args: string[]): UserInfo | null {
  if (args.length < 2) return null;

  const [genderStr, heightStr] = args;
  const gender = validateGender();
  const height = validateHeight();
  if (gender == null || height == null) return null;
  return { gender, height };

  function validateGender(): Gender | null {
    const lower = genderStr.toLowerCase();
    if (lower === 'м') return 'male';
    if (lower === 'ж') return 'female';
    return null;
  }

  function validateHeight(): Cm | null {
    const value = parseNumber(heightStr);
    if (value != null && value >= 100 && value <= 300) return value as Cm;
    return null;
  }
}
