/* tslint:disable:binary-expression-operand-order no-identical-functions */
/**
 * Источники:
 * * http://www.bmi-calculator.net/ideal-weight-calculator/
 * * https://beregifiguru.ru/%D0%9A%D0%B0%D0%BB%D1%8C%D0%BA%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%D1%8B/%D0%A0%D0%B0%D1%81%D1%87%D0%B5%D1%82-%D0%B8%D0%B4%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B3%D0%BE-%D0%B2%D0%B5%D1%81%D0%B0
 */
import { getHealthyRange } from 'src/app/core/BMI/BMI';
import { IdealWeight } from 'src/app/core/BMI/types';
import { Cm, Gender, Kg } from 'src/app/shared/types';
import { roundDown, roundToTwo, roundUp } from 'src/shared/utils/parseNumber';
import { median } from 'stats-lite';

export function broca(height: Cm, gender: Gender): Kg {
  const coeff = gender === 'male' ? 0.9 : 0.85;
  const weight = (height - 100) * coeff;
  return roundToTwo(weight) as Kg;
}

export function brocaBrugsh(height: Cm): Kg {
  // eslint-disable-next-line no-nested-ternary
  const coeff = height < 165 ? 100 : height > 175 ? 110 : 105;
  const weight = height - coeff;
  return roundToTwo(weight) as Kg;
}

export function devine(height: Cm, gender: Gender): Kg {
  const coeff = gender === 'male' ? 50 : 45.5;
  const weight = coeff + 2.3 * (0.393701 * height - 60);
  return roundToTwo(weight) as Kg;
}

export function robinson(height: Cm, gender: Gender): Kg {
  const d = 0.393701 * height - 60;
  const weight = gender === 'male' ? 52 + 1.9 * d : 49 + 1.7 * d;
  return roundToTwo(weight) as Kg;
}

export function miller(height: Cm, gender: Gender): Kg {
  const d = 0.393701 * height - 60;
  const weight = gender === 'male' ? 56.2 + 1.41 * d : 53.1 + 1.36 * d;
  return roundToTwo(weight) as Kg;
}

export function hamwi(height: Cm, gender: Gender): Kg {
  const d = 0.393701 * height - 60;
  const weight = gender === 'male' ? 48 + 2.7 * d : 45.5 + 2.2 * d;
  return roundToTwo(weight) as Kg;
}

export function lemmens(height: Cm): Kg {
  const weight = 22 * (height / 100) ** 2;
  return roundToTwo(weight) as Kg;
}

export function averageHealthyBMI(height: Cm, gender: Gender): Kg {
  const range = getHealthyRange(gender, height);
  return roundToTwo(median(range)) as Kg;
}

export function lorenz(height: Cm, gender: Gender): Kg {
  const coeff = gender === 'male' ? 4 : 2;
  const weight = height - 100 - (height - 150) / coeff;
  return roundToTwo(weight) as Kg;
}

export function mohammed(height: Cm): Kg {
  const weight = height * height * 0.00225;
  return roundToTwo(weight) as Kg;
}

export function insurance(height: Cm): Kg {
  const AGE = 25;
  const weight = 50 + 0.75 * (height - 150) + (AGE - 20) / 4;
  return roundToTwo(weight) as Kg;
}

export function kuper(height: Cm, gender: Gender): Kg {
  const weight = gender === 'male' ? 0.713 * height - 58 : 0.624 * height - 48.9;
  return roundToTwo(weight) as Kg;
}

export function breitman(height: Cm): Kg {
  const weight = height * 0.7 - 50;
  return roundToTwo(weight) as Kg;
}

export function tetona(height: Cm, gender: Gender): Kg {
  const coeff = gender === 'male' ? 20 : 10;
  const weight = height - (100 + (height - 100) / coeff);
  return roundToTwo(weight) as Kg;
}

const formulas = [
  averageHealthyBMI,
  broca,
  brocaBrugsh,
  devine,
  hamwi,
  kuper,
  lemmens,
  lorenz,
  miller,
  mohammed,
  robinson,
  tetona,
];

export function calcIdealWeight(height: Cm, gender: Gender): IdealWeight {
  const values = formulas.map(f => f(height, gender));
  const avg = roundToTwo(median(values), 0) as Kg;
  const min = roundDown(Math.min(...values), 0) as Kg;
  const max = roundUp(Math.max(...values), 0) as Kg;
  return { avg, min, max };
}
