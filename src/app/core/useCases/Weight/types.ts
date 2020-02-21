import { BMIResultOrError } from 'src/app/core/useCases/BMI/GetBMIUseCase';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { MeasureDifferenceSummary } from 'src/app/shared/measureDifference';
import { Kg, Measure } from 'src/app/shared/types';

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
