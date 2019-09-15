import Big from 'big.js';
import { calcBMICoeff } from 'src/app/bot/BMI/BMICalc';
import { BMI, Cm, Gender, Kg } from 'src/app/shared/types';
import { roundToTwo } from 'src/shared/utils/parseNumber';

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
type Position = number;
type BMICategoryParams = {
  name: BMICategoryName;
  position: Position;
  lowerBMI: { [gender in Gender]: BMI };
  upperBMI: { [gender in Gender]: BMI };
};
export type SuggestedWeightDiff =
  | { alreadyHealthy: true }
  | { alreadyHealthy: false; toHealthy: Kg; toNext: SuggestedNextDiff | null };
export type SuggestedNextDiff = {
  categoryName: BMICategoryName;
  diff: Kg;
};

export class BMICategory {
  static categories: Map<Position, BMICategory> = new Map();

  readonly name: BMICategoryName;
  private readonly position: Position;
  private readonly lowerBMI: { [gender in Gender]: BMI };
  private readonly upperBMI: { [gender in Gender]: BMI };

  constructor({ name, position, lowerBMI, upperBMI }: BMICategoryParams) {
    this.name = name;
    this.position = position;
    this.lowerBMI = lowerBMI;
    this.upperBMI = upperBMI;
  }

  static getHealthyRange(gender: Gender, height: Cm): [Kg, Kg] {
    const normal = BMICategory.categories.get(0);
    if (normal == null) throw Error('normal category not found');
    return normal.getRangeWeight(gender, height);
  }

  inRange(gender: Gender, bmi: BMI): boolean {
    return bmi >= this.lowerBMI[gender] && bmi < this.upperBMI[gender];
  }

  getRangeWeight(gender: Gender, height: Cm): [Kg, Kg] {
    const [lowerBMI, upperBMI] = this.getRangeBMI(gender);

    const coeff = calcBMICoeff(height);
    const lower = (lowerBMI / 1.3) * coeff;
    const upper = (upperBMI / 1.3) * coeff;

    return [roundToTwo(lower) as Kg, roundToTwo(upper) as Kg];
  }

  getSuggest(gender: Gender, height: Cm, weight: Kg): SuggestedWeightDiff {
    if (this.name === 'Normal') return { alreadyHealthy: true };

    return {
      alreadyHealthy: false,
      toHealthy: this.toHealthy(gender, height, weight),
      toNext: this.toNext(gender, height, weight),
    };
  }

  private getRangeBMI(gender: Gender): [BMI, BMI] {
    return [this.lowerBMI[gender], this.upperBMI[gender]];
  }

  private toHealthy(gender: Gender, height: Cm, weight: Kg): Kg {
    const [healthyLower, healthyUpper] = BMICategory.getHealthyRange(gender, height);
    const healthyWeight = this.position < 0 ? healthyLower : healthyUpper;
    return roundUpKg(Big(healthyWeight).minus(weight));
  }

  private toNext(gender: Gender, height: Cm, weight: Kg): SuggestedNextDiff | null {
    if (this.position === -1 || this.position === 1) return null;

    const nextPosition = this.position < 0 ? this.position + 1 : this.position - 1;
    const next = BMICategory.categories.get(nextPosition);
    if (next == null) {
      throw new Error(`next should be defined. ${JSON.stringify({ gender, height, weight, name: this.name })}`);
    }

    const [lower, upper] = next.getRangeWeight(gender, height).map(roundUpKg);
    const nextWeight = this.position < 0 ? lower : upper;
    const diff = roundUpKg(Big(nextWeight).minus(weight));
    return {
      categoryName: next.name,
      diff,
    };
  }
}

// eslint-disable-next-line fatmotorbot/max-lines-per-function-ignore-nested
function addCategories() {
  type FemaleBMI = number;
  type MaleBMI = number;
  const names: [BMICategoryName, [FemaleBMI, MaleBMI]][] = [
    ['Very severely underweight', [15, 15]],
    ['Severely underweight', [16, 18]],
    ['Underweight', [19, 20]],
    ['Normal', [24, 25]],
    ['Overweight', [30, 30]],
    ['Obese I', [35, 35]],
    ['Obese II', [40, 40]],
    ['Obese III', [45, 45]],
    ['Obese IV', [50, 50]],
    ['Obese V', [60, 60]],
    ['Obese VI+', [Infinity, Infinity]],
  ];
  let pos = -3;
  let lower = [-Infinity, -Infinity] as [FemaleBMI, MaleBMI];
  for (const [name, upper] of names) {
    addCategory(pos, name, lower, upper);
    lower = upper;
    pos += 1;
  }

  // eslint-disable-next-line max-params
  function addCategory(
    position: Position,
    name: BMICategoryName,
    lowerBMI: [FemaleBMI, MaleBMI],
    upperBMI: [FemaleBMI, MaleBMI],
  ) {
    BMICategory.categories.set(
      position,
      new BMICategory({
        name,
        position,
        lowerBMI: { female: lowerBMI[0] as BMI, male: lowerBMI[1] as BMI },
        upperBMI: { female: upperBMI[0] as BMI, male: upperBMI[1] as BMI },
      }),
    );
  }
}

export function getBMICategoryName(gender: Gender, bmi: BMI): BMICategoryName {
  return getBMICategory(gender, bmi).name;
}

export function getBMICategory(gender: Gender, bmi: BMI): BMICategory {
  for (const cat of BMICategory.categories.values()) {
    if (cat.inRange(gender, bmi)) return cat;
  }
  throw Error(`BMI category not found. gender: "${gender}", bmi: "${bmi}"`);
}

export function getHealthyRange(gender: Gender, height: Cm): [Kg, Kg] {
  return BMICategory.getHealthyRange(gender, height);
}

function roundUpKg(value: number | Big): Kg {
  // prettier-ignore
  return parseInt(Big(value).round(0, 3 /* ROUND_UP */).toFixed(), 10) as Kg;
}

addCategories();
