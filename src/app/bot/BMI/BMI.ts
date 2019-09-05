/* tslint:disable:no-duplicate-string max-classes-per-file */
import Big from 'big.js';
import { BMI, Cm, Gender, Kg } from 'src/app/shared/types';
import { roundToTwo } from 'src/shared/utils/parseNumber';
import { StacklessError } from 'src/shared/utils/StacklessError';

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

const categories: Map<BMICategoryName, BMICategory> = new Map();

interface IBMICategoryParams {
  name: BMICategoryName;
  position: number;
  prev?: BMICategoryName;
  next?: BMICategoryName;
  lowerBMI: { [gender in Gender]: BMI };
  upperBMI: { [gender in Gender]: BMI };
}

type SuggestedWeightDiff =
  | { alreadyHealthy: true }
  | { alreadyHealthy: false; toHealthy: Kg; toNext: SuggestedNextDiff | null };

type SuggestedNextDiff = {
  categoryName: BMICategoryName;
  diff: Kg;
};

class BMICategory {
  readonly name: BMICategoryName;
  readonly position: number;
  readonly lowerBMI: { [gender in Gender]: BMI };
  readonly upperBMI: { [gender in Gender]: BMI };
  readonly prev?: BMICategoryName;
  readonly next?: BMICategoryName;

  constructor({ name, position, lowerBMI, upperBMI, prev, next }: IBMICategoryParams) {
    this.name = name;
    this.position = position;
    this.prev = prev;
    this.next = next;
    this.lowerBMI = lowerBMI;
    this.upperBMI = upperBMI;
  }

  getRangeBMI(gender: Gender): [BMI, BMI] {
    return [this.lowerBMI[gender], this.upperBMI[gender]];
  }

  getRangeWeight(gender: Gender, height: Cm): [Kg, Kg] {
    const [lowerBMI, upperBMI] = this.getRangeBMI(gender);

    const coeff = calcBMICoeff(height);
    const lower = (lowerBMI / 1.3) * coeff;
    const upper = (upperBMI / 1.3) * coeff;

    return [roundUp(lower), roundUp(upper)];
  }

  getSuggest(gender: Gender, height: Cm, weight: Kg): SuggestedWeightDiff {
    if (this.name === 'Normal') return { alreadyHealthy: true };

    return {
      alreadyHealthy: false,
      toHealthy: this.toHealthy(gender, height, weight),
      toNext: this.toNext(gender, height, weight),
    };
  }

  private toHealthy(gender: Gender, height: Cm, weight: Kg): Kg {
    const [healthyLower, healthyUpper] = getHealthyRange(gender, height);
    const healthyWeight = this.position < 0 ? healthyLower : healthyUpper;
    return roundUp(Big(healthyWeight).minus(weight));
  }

  private toNext(gender: Gender, height: Cm, weight: Kg): SuggestedNextDiff | null {
    if (this.position === -1 || this.position === 1) return null;

    const nextName = this.position < 0 ? this.next : this.prev;
    const next = categories.get(nextName as BMICategoryName);
    if (next == null) throw new StacklessError('next should be defined', { gender, height, weight, name: this.name });

    const [lower, upper] = next.getRangeWeight(gender, height);
    const nextWeight = this.position < 0 ? lower : upper;
    const diff = roundUp(Big(nextWeight).minus(weight));
    return {
      categoryName: next.name,
      diff,
    };
  }
}

const VerySeverelyUnderweight = new BMICategory({
  name: 'Very severely underweight',
  position: -3,
  prev: undefined,
  next: 'Severely underweight',
  lowerBMI: { female: -Infinity as BMI, male: -Infinity as BMI },
  upperBMI: { female: 15 as BMI, male: 15 as BMI },
});
categories.set(VerySeverelyUnderweight.name, VerySeverelyUnderweight);

const SeverelyUnderweight = new BMICategory({
  name: 'Severely underweight',
  position: -2,
  prev: 'Very severely underweight',
  next: 'Underweight',
  lowerBMI: { female: 15 as BMI, male: 15 as BMI },
  upperBMI: { female: 16 as BMI, male: 18 as BMI },
});
categories.set(SeverelyUnderweight.name, SeverelyUnderweight);

const Underweight = new BMICategory({
  name: 'Underweight',
  position: -1,
  prev: 'Severely underweight',
  next: 'Normal',
  lowerBMI: { female: 16 as BMI, male: 18 as BMI },
  upperBMI: { female: 19 as BMI, male: 20 as BMI },
});
categories.set(Underweight.name, Underweight);

const Normal = new BMICategory({
  name: 'Normal',
  position: 0,
  prev: 'Underweight',
  next: 'Overweight',
  lowerBMI: { female: 19 as BMI, male: 20 as BMI },
  upperBMI: { female: 24 as BMI, male: 25 as BMI },
});
categories.set(Normal.name, Normal);

const Overweight = new BMICategory({
  name: 'Overweight',
  position: 1,
  prev: 'Normal',
  next: 'Obese I',
  lowerBMI: { female: 24 as BMI, male: 25 as BMI },
  upperBMI: { female: 30 as BMI, male: 30 as BMI },
});
categories.set(Overweight.name, Overweight);

const Obese1 = new BMICategory({
  name: 'Obese I',
  position: 2,
  prev: 'Overweight',
  next: 'Obese I',
  lowerBMI: { female: 30 as BMI, male: 30 as BMI },
  upperBMI: { female: 35 as BMI, male: 35 as BMI },
});
categories.set(Obese1.name, Obese1);

const Obese2 = new BMICategory({
  name: 'Obese II',
  position: 3,
  prev: 'Obese I',
  next: 'Obese III',
  lowerBMI: { female: 35 as BMI, male: 35 as BMI },
  upperBMI: { female: 40 as BMI, male: 40 as BMI },
});
categories.set(Obese2.name, Obese2);

const Obese3 = new BMICategory({
  name: 'Obese III',
  position: 4,
  prev: 'Obese II',
  next: 'Obese IV',
  lowerBMI: { female: 40 as BMI, male: 40 as BMI },
  upperBMI: { female: 45 as BMI, male: 45 as BMI },
});
categories.set(Obese3.name, Obese3);

const Obese4 = new BMICategory({
  name: 'Obese IV',
  position: 5,
  prev: 'Obese III',
  next: 'Obese V',
  lowerBMI: { female: 45 as BMI, male: 45 as BMI },
  upperBMI: { female: 50 as BMI, male: 50 as BMI },
});
categories.set(Obese4.name, Obese4);

const Obese5 = new BMICategory({
  name: 'Obese V',
  position: 6,
  prev: 'Obese IV',
  next: 'Obese VI+',
  lowerBMI: { female: 50 as BMI, male: 50 as BMI },
  upperBMI: { female: 60 as BMI, male: 60 as BMI },
});
categories.set(Obese5.name, Obese5);

const Obese6 = new BMICategory({
  name: 'Obese VI+',
  position: 7,
  prev: 'Obese V',
  next: undefined,
  lowerBMI: { female: 60 as BMI, male: 60 as BMI },
  upperBMI: { female: Infinity as BMI, male: Infinity as BMI },
});
categories.set(Obese6.name, Obese6);

export function getBMICategoryName(gender: Gender, bmi: BMI): BMICategoryName {
  return getBMICategory(gender, bmi).name;
}

function getBMICategory(gender: Gender, bmi: BMI): BMICategory {
  for (const cat of categories.values()) {
    const part1 = bmi >= cat.lowerBMI[gender];
    const part2 = bmi < cat.upperBMI[gender];
    if (part1 && part2) return cat;
  }
  throw Error(`BMI category not found. gender: "${gender}", bmi: "${bmi}"`);
}

export function getHealthyRange(gender: Gender, height: Cm): [Kg, Kg] {
  const normal = categories.get('Normal');
  if (normal == null) throw Error('normal category not found');

  return normal.getRangeWeight(gender, height);
}

export function getSuggestedWeightDiff(gender: Gender, height: Cm, weight: Kg): SuggestedWeightDiff {
  const bmi = calcBMI(height, weight);
  const category = getBMICategory(gender, bmi);
  return category.getSuggest(gender, height, weight);
}

function roundUp(value: number | Big): Kg {
  // prettier-ignore
  return parseInt(Big(value).round(0, 3 /* ROUND_UP */).toFixed(), 10) as Kg;
}
