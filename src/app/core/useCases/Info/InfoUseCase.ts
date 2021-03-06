import { IInfoRepository, UserInfo } from 'src/app/core/repositories/InfoRepository';
import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import { calcBMIFromUserInfo } from 'src/app/core/services/BMI/BMI';
import { validateGender, validateHeight } from 'src/app/core/services/validators';
import { IInfoUseCaseGet, InfoAddErrors, InfoGetResult, InfoSetResult } from 'src/app/core/useCases/Info/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

interface IInfoUseCaseSet {
  set(userId: TelegramUserId, args: string[]): Promise<Result<InfoSetResult, InfoAddErrors>>;
}

interface IInfoUseCase extends IInfoUseCaseGet, IInfoUseCaseSet {}

export class InfoUseCase implements IInfoUseCase {
  constructor(private readonly infoRepository: IInfoRepository, readonly weightRepository: IWeightRepository) {}

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

    const bmiResult = await calcBMIFromUserInfo(userId, data, this.weightRepository);
    const bmi = bmiResult.isErr ? null : bmiResult.value;

    return Result.ok({ case: 'set', data, bmi });
  }
}

export function validateData(args: string[]): UserInfo | null {
  if (args.length < 2) return null;

  const [genderStr, heightStr] = args;
  const gender = validateGender(genderStr);
  const height = validateHeight(heightStr);
  if (gender == null || height == null) return null;
  return { gender, height };
}
