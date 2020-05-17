import { BMI, Cm, Kg } from 'src/app/shared/types';
import { roundToTwo } from 'src/shared/utils/parseNumber';

/**
 * Вычисляет ИМТ, используя "новую" формулу.
 * http://people.maths.ox.ac.uk/trefethen/bmi_calc.html
 */
export function calcBMIValue(height: Cm, weight: Kg): BMI {
  const bmi = (weight * 1.3) / calcBMICoeff(height);
  return roundToTwo(bmi) as BMI;
}

export function calcBMICoeff(height: Cm) {
  return (((height / 100) * height) / 100) * Math.sqrt(height / 100);
}
