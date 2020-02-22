import { IInfoRepository, UserInfo } from 'src/app/core/repositories/InfoRepository';
import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import { GetBMIUseCase } from 'src/app/core/useCases/BMI/GetBMIUseCase';
import { IInfoUseCaseGet, InfoAddErrors, InfoGetResult, InfoSetResult } from 'src/app/core/useCases/Info/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { Cm, Gender, TelegramUserId } from 'src/app/shared/types';
import { parseNumber } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

interface IInfoUseCaseSet {
  set(userId: TelegramUserId, args: string[]): Promise<Result<InfoSetResult, InfoAddErrors>>;
}

interface IInfoUseCase extends IInfoUseCaseGet, IInfoUseCaseSet {}

export class InfoUseCase implements IInfoUseCase {
  private readonly bmiUseCase: GetBMIUseCase;

  constructor(private readonly infoRepository: IInfoRepository, readonly weightRepository: IWeightRepository) {
    this.bmiUseCase = new GetBMIUseCase(this, weightRepository);
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

    const bmiResult = await this.bmiUseCase.get(userId, { userInfo: data });
    const bmi = bmiResult.isErr ? null : bmiResult.value;

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
