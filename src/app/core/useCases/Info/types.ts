import type { UserInfo } from 'src/app/core/repositories/InfoRepository';
import { BMIResult } from 'src/app/core/services/BMI/utils/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import type { TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export type InfoAddErrors = InvalidFormatError | DatabaseError;
export type InfoSetResult = { case: 'set'; data: UserInfo; bmi: null | BMIResult };
export type InfoGetResult = { case: 'get:no-user-info' } | { case: 'get'; data: UserInfo };

export interface IInfoUseCaseGet {
  get(userId: TelegramUserId): Promise<Result<InfoGetResult, DatabaseError>>;
}
