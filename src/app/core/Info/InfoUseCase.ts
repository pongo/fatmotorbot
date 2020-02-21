import { SlonikError } from 'slonik';
import { calcBMIResult } from 'src/app/core/BMI/calcBMIResult';
import { BMIResult } from 'src/app/core/BMI/types';
import { IInfoRepository, UserInfo } from 'src/app/core/Info/InfoRepository';
import { IWeightRepositoryGetCurrent } from 'src/app/core/Weight/WeightRepository';
import { InvalidFormatError } from 'src/app/shared/errors';
import { Cm, Gender, TelegramUserId } from 'src/app/shared/types';
import { parseNumber } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

export type InfoAddErrors = InvalidFormatError | SlonikError;
export type InfoSetResult = { case: 'set'; data: UserInfo; bmi: null | BMIResult };
export type InfoGetResult = { case: 'get:none' } | { case: 'get'; data: UserInfo };

export interface IInfoUseCaseGet {
  get(userId: TelegramUserId): Promise<Result<InfoGetResult, SlonikError>>;
}

interface IInfoUseCaseSet {
  set(userId: TelegramUserId, args: string[]): Promise<Result<InfoSetResult, InfoAddErrors>>;
}

interface IInfoUseCase extends IInfoUseCaseGet, IInfoUseCaseSet {}

export class InfoUseCase implements IInfoUseCase {
  constructor(
    private readonly infoRepository: IInfoRepository,
    private readonly weightRepository: IWeightRepositoryGetCurrent,
  ) {}

  async get(userId: TelegramUserId): Promise<Result<InfoGetResult, SlonikError>> {
    console.debug(`InfoUseCase.get(${userId});`);

    const result = await this.infoRepository.get(userId);
    if (result.isErr) return result;

    if (result.value == null) return Result.ok({ case: 'get:none' });
    return Result.ok({ case: 'get', data: result.value });
  }

  async set(userId: TelegramUserId, args: string[]): Promise<Result<InfoSetResult, InfoAddErrors>> {
    console.log(`InfoUseCase.add(${userId}, [${args}]);`);

    const data = validateData(args);
    if (data == null) return Result.err(new InvalidFormatError());

    const addResult = await this.infoRepository.set(userId, data);
    if (addResult.isErr) return addResult;

    const weightResult = await this.weightRepository.getCurrent(userId);
    const weight = weightResult.isErr ? null : weightResult.value;
    const bmi = weight == null ? null : calcBMIResult(weight, data);

    return Result.ok({ case: 'set', data, bmi });
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
