import { BMIResult } from 'src/app/core/BMI/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { Cm, Gender, TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export type UserInfo = {
  gender: Gender;
  height: Cm;
};

export interface IInfoRepository {
  get(userId: TelegramUserId): Promise<Result<UserInfo | null, DatabaseError>>;
  set(userId: TelegramUserId, data: UserInfo): Promise<Result<undefined, DatabaseError>>;
}

export type InfoAddErrors = InvalidFormatError | DatabaseError;
export type InfoSetResult = { case: 'set'; data: UserInfo; bmi: null | BMIResult };
export type InfoGetResult = { case: 'get:no-user-info' } | { case: 'get'; data: UserInfo };

export interface IInfoUseCaseGet {
  get(userId: TelegramUserId): Promise<Result<InfoGetResult, DatabaseError>>;
}
