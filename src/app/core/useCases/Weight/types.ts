import { BMIResultOrError } from 'src/app/core/services/BMI/utils/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { MeasureDifferenceSummary } from 'src/app/core/services/measureDifference';
import {
  Kg,
  Measure,
  MeasuresFromNewestToOldest,
  MeasuresFromOldestToNewest,
  TelegramUserId,
} from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

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
  chart?: DataForChart;
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
  chart?: DataForChart;
};

export type YYYYMMDD = string;
export type DataForChart = {
  userId: TelegramUserId;
  data: MeasuresFromOldestToNewest<Kg>;
  user?: {
    health: { min: Kg; max: Kg };
    ideal: { min: Kg; max: Kg };
    next?: Kg;
  };
};

export type GetDataForChartPrepared = {
  measuresResult?: Result<MeasuresFromNewestToOldest<Kg>, DatabaseError>;
  bmiResult: BMIResultOrError;
};
