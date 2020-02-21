import { calcBMI } from 'src/app/core/BMI/BMICalc';
import { getBMICategory, SuggestedWeightDiff } from 'src/app/core/BMI/BMICategory';
import { Cm, Gender, Kg } from 'src/app/shared/types';

export function getSuggestedWeightDiff(gender: Gender, height: Cm, weight: Kg): SuggestedWeightDiff {
  const bmi = calcBMI(height, weight);
  const category = getBMICategory(gender, bmi);
  return category.getSuggest(gender, height, weight);
}

export { calcBMI } from 'src/app/core/BMI/BMICalc';
export { getBMICategoryName, getHealthyRange } from 'src/app/core/BMI/BMICategory';
