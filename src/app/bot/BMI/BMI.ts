/* tslint:disable:no-duplicate-string */
import { BMI, Cm, Gender, Kg } from 'src/app/shared/types';
import { roundToTwo } from 'src/shared/utils/parseNumber';

function calcBMICoeff(height: Cm) {
  return (((height / 100) * height) / 100) * Math.sqrt(height / 100);
}

/**
 * Вычисляет ИМТ, используя "новую" формулу
 *
 * http://people.maths.ox.ac.uk/trefethen/bmi_calc.html
 */
export function calcBMI(height: Cm, weight: Kg): BMI {
  const bmi = (weight * 1.3) / calcBMICoeff(height);
  return roundToTwo(bmi) as BMI;
}

export type BMICategory =
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

export function getBMICategory(gender: Gender, bmi: BMI): BMICategory {
  if (bmi < 15) return 'Very severely underweight';
  return gender === 'male' ? getMaleBMICategory(bmi) : getFemaleBMICategory(bmi);
}

function getFemaleBMICategory(bmi: BMI): BMICategory {
  if (bmi < 16) return 'Severely underweight';
  if (bmi < 19) return 'Underweight';
  if (bmi < 24) return 'Normal';
  return getGenericBMICategory(bmi);
}

// tslint:disable-next-line:no-identical-functions
function getMaleBMICategory(bmi: BMI): BMICategory {
  if (bmi < 18) return 'Severely underweight';
  if (bmi < 20) return 'Underweight';
  if (bmi < 25) return 'Normal';
  return getGenericBMICategory(bmi);
}

function getGenericBMICategory(bmi: BMI): BMICategory {
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese I';
  if (bmi < 40) return 'Obese II';
  if (bmi < 45) return 'Obese III';
  if (bmi < 50) return 'Obese IV';
  if (bmi < 60) return 'Obese V';
  return 'Obese VI+';
}

export function getHealthyRange(gender: Gender, height: Cm): [Kg, Kg] {
  const [lowerBMI, upperBMI] = gender === 'male' ? [20, 25] : [19, 24];

  const coeff = calcBMICoeff(height);
  const targetLower = (lowerBMI / 1.3) * coeff;
  const targetUpper = (upperBMI / 1.3) * coeff;

  return [roundToTwo(targetLower) as Kg, roundToTwo(targetUpper) as Kg];
}
