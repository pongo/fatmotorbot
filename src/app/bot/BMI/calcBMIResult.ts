import { getSuggestedWeightDiff } from 'src/app/bot/BMI/BMI';
import { calcBMI } from 'src/app/bot/BMI/BMICalc';
import { getBMICategoryName, getHealthyRange } from 'src/app/bot/BMI/BMICategory';
import { calcIdealWeight } from 'src/app/bot/BMI/IdealWeight';
import { BMIResult } from 'src/app/bot/BMI/types';
import { UserInfo } from 'src/app/bot/InfoCommand/InfoRepository';
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
