import { BMICategoryName, SuggestedWeightDiff } from 'src/app/bot/BMI/BMICategory';
import { IdealWeight } from 'src/app/bot/BMI/IdealWeight';
import { BMI, Kg } from 'src/app/shared/types';

export type BMIResult =
  | { case: 'need-user-info' }
  | {
  case: 'bmi';
  bmi: BMI;
  categoryName: BMICategoryName;
  healthyRange: [Kg, Kg];
  suggest: SuggestedWeightDiff;
  ideal: IdealWeight;
};