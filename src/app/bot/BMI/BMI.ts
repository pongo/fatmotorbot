/* eslint-disable class-methods-use-this,@typescript-eslint/tslint/config */
/* tslint:disable:no-duplicate-string max-classes-per-file */
import { BMI, Cm, Gender, Kg } from 'src/app/shared/types';
import { roundToTwo } from 'src/shared/utils/parseNumber';

/**
 * Вычисляет ИМТ, используя "новую" формулу
 *
 * http://people.maths.ox.ac.uk/trefethen/bmi_calc.html
 */
export function calcBMI(height: Cm, weight: Kg): BMI {
  const bmi = (weight * 1.3) / calcBMICoeff(height);
  return roundToTwo(bmi) as BMI;
}

function calcBMICoeff(height: Cm) {
  return (((height / 100) * height) / 100) * Math.sqrt(height / 100);
}

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

abstract class BaseBMICategory {
  abstract category: BMICategoryName;
  abstract check(_bmi: BMI, _gender?: Gender): boolean;
}

class VerySeverelyUnderweight implements BaseBMICategory {
  category = 'Very severely underweight' as const;

  check(bmi: BMI): boolean {
    return bmi < 15;
  }
}

class SeverelyUnderweight implements BaseBMICategory {
  category = 'Severely underweight' as const;

  check(bmi: BMI, gender: Gender): boolean {
    return bmi < (gender === 'female' ? 16 : 18);
  }
}

class Underweight implements BaseBMICategory {
  category = 'Underweight' as const;

  check(bmi: BMI, gender: Gender): boolean {
    return bmi < (gender === 'female' ? 19 : 20);
  }
}

class Normal implements BaseBMICategory {
  category = 'Normal' as const;

  check(bmi: BMI, gender: Gender): boolean {
    return bmi < (gender === 'female' ? 24 : 25);
  }

  static getRange(gender: Gender): [BMI, BMI] {
    const [lower, upper] = gender === 'female' ? [19, 24] : [20, 25];
    return [lower as BMI, upper as BMI];
  }
}

class Overweight implements BaseBMICategory {
  category = 'Overweight' as const;

  check(bmi: BMI): boolean {
    return bmi < 30;
  }
}

class Obese1 implements BaseBMICategory {
  category = 'Obese I' as const;

  check(bmi: BMI): boolean {
    return bmi < 35;
  }
}

class Obese2 implements BaseBMICategory {
  category = 'Obese II' as const;

  check(bmi: BMI): boolean {
    return bmi < 40;
  }
}

class Obese3 implements BaseBMICategory {
  category = 'Obese III' as const;

  check(bmi: BMI): boolean {
    return bmi < 45;
  }
}

class Obese4 implements BaseBMICategory {
  category = 'Obese IV' as const;

  check(bmi: BMI): boolean {
    return bmi < 50;
  }
}

class Obese5 implements BaseBMICategory {
  category = 'Obese V' as const;

  check(bmi: BMI): boolean {
    return bmi < 60;
  }
}

class Obese6 implements BaseBMICategory {
  category = 'Obese VI+' as const;

  check(bmi: BMI): boolean {
    return bmi >= 60;
  }
}

const categories: BaseBMICategory[] = [
  new VerySeverelyUnderweight(),
  new SeverelyUnderweight(),
  new Underweight(),
  new Normal(),
  new Overweight(),
  new Obese1(),
  new Obese2(),
  new Obese3(),
  new Obese4(),
  new Obese5(),
  new Obese6(),
];

export function getBMICategory(gender: Gender, bmi: BMI): BMICategoryName {
  for (const cat of categories) {
    if (cat.check(bmi, gender)) return cat.category;
  }
  throw Error(`BMI category not found. gender: "${gender}", bmi: "${bmi}"`);
}

export function getHealthyRange(gender: Gender, height: Cm): [Kg, Kg] {
  const [lowerBMI, upperBMI] = Normal.getRange(gender);

  const coeff = calcBMICoeff(height);
  const targetLower = (lowerBMI / 1.3) * coeff;
  const targetUpper = (upperBMI / 1.3) * coeff;

  return [roundToTwo(targetLower) as Kg, roundToTwo(targetUpper) as Kg];
}
