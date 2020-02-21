import { BMIResultOrError } from 'src/app/core/BMI/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { MeasureDifferenceSummary } from 'src/app/shared/measureDifference';
import { Kg, Measure, MeasuresFromNewestToOldest, TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export interface IWeightRepositoryGetCurrent {
  getCurrent(userId: TelegramUserId): Promise<Result<Kg | null, DatabaseError>>;
}

export interface IWeightRepository extends IWeightRepositoryGetCurrent {
  add(userId: TelegramUserId, weight: Kg, date: Date): Promise<Result>;
  getAll(userId: TelegramUserId): Promise<Result<MeasuresFromNewestToOldest<Kg>, DatabaseError>>;
}

export const enum WeightCases {
  addFirst = 'add:first',
  addDiff = 'add:diff',
  currentEmpty = 'current:empty',
  currentFirst = 'current:first',
  currentDiff = 'current:diff',
}

export type WeightAdded = WeightAddedFirst | WeightAddedDiff;

export type WeightAddedFirst = {
  case: WeightCases.addFirst;
  weight: Kg;
  bmi: BMIResultOrError;
};

export type WeightAddedDiff = {
  case: WeightCases.addDiff;
  diff: MeasureDifferenceSummary<Kg>;
  weight: Kg;
  bmi: BMIResultOrError;
};

export type WeightAddedErrors = InvalidFormatError | DatabaseError;

export type CurrentWeight = CurrentWeightEmpty | CurrentWeightFirst | CurrentWeightDiff;

export type CurrentWeightEmpty = {
  case: WeightCases.currentEmpty;
};

export type CurrentWeightFirst = {
  case: WeightCases.currentFirst;
  current: Measure<Kg>;
  bmi: BMIResultOrError;
};

export type CurrentWeightDiff = {
  case: WeightCases.currentDiff;
  current: Measure<Kg>;
  diff: MeasureDifferenceSummary<Kg>;
  bmi: BMIResultOrError;
};
