import { getSuggestedWeightDiff } from 'src/app/core/BMI/BMI';
import { calcBMI } from 'src/app/core/BMI/BMICalc';
import { getBMICategoryName, getHealthyRange } from 'src/app/core/BMI/BMICategory';
import { calcIdealWeight } from 'src/app/core/BMI/IdealWeight';
import { BMIResult } from 'src/app/core/BMI/types';
import { UserInfo } from 'src/app/core/Info/types';
import { Kg } from 'src/app/shared/types';

export function calcBMIResult(weight: Kg, { gender, height }: UserInfo): BMIResult {
  const bmi = calcBMI(height, weight);
  return {
    case: 'bmi',
    bmi,
    categoryName: getBMICategoryName(gender, bmi),
    healthyRange: getHealthyRange(gender, height),
    suggest: getSuggestedWeightDiff(gender, height, weight),
    ideal: calcIdealWeight(height, gender),
  };
}
