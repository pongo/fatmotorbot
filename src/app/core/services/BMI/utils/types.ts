import { DatabaseError } from 'src/app/shared/errors';
import { BMI, IdealWeight, Kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export type BMICategoryName =
  | 'Very severely underweight'
  | 'Severely underweight'
  | 'Underweight'
  | 'Normal'
  | 'Overweight'
  | 'Obese I'
  | 'Obese II'
  | 'Obese III'
  | 'Obese IV'
  | 'Obese V'
  | 'Obese VI+';

export type SuggestedWeightDiff =
  | { alreadyHealthy: true }
  | { alreadyHealthy: false; toHealthy: Kg; toNext: SuggestedNextDiff | null };

export type SuggestedNextDiff = {
  categoryName: BMICategoryName;
  diff: Kg;
  nextWeight: Kg;
};

export type BMIFullResult = {
  case: 'bmi';
  bmi: BMI;
  categoryName: BMICategoryName;
  healthyRange: [Kg, Kg];
  suggest: SuggestedWeightDiff;
  ideal: IdealWeight;
};

export type BMIResult = { case: 'need-user-weight' } | { case: 'need-user-info' } | BMIFullResult;

export type BMIResultOrError = Result<BMIResult, DatabaseError>;
