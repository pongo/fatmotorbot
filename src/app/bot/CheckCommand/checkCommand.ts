import { bmiPresenter } from 'src/app/bot/presenters/bmiPresenter';
import { UserInfo } from 'src/app/core/repositories/InfoRepository';
import { calcBMIResult } from 'src/app/core/useCases/BMI/GetBMIUseCase';
import { Kg } from 'src/app/shared/types';
import { validateGender, validateHeight, validateWeight } from 'src/app/shared/validators';
import { parseNumber } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

export type CheckParams = {
  weight: Kg;
  userInfo: UserInfo;
};

export function validate(args: string[]): CheckParams | null {
  if (args.length !== 3) return null;

  const [genderStr, heightStr, weightStr] = args;
  const gender = validateGender(genderStr);
  const height = validateHeight(heightStr);
  const weight = validateWeight(parseNumber(weightStr));
  if (gender == null || height == null || weight == null) return null;

  return { weight, userInfo: { gender, height } };
}

function calc(params: CheckParams) {
  return Result.ok(calcBMIResult(params.weight, params.userInfo));
}

export function present(params: CheckParams | null): string {
  if (params === null) {
    return `
Укажи данные командой: /check пол рост вес, где:
• пол — м или ж
• рост в см
• вес в кг

Пример: /check ж 164 45
Альтернатива: /bmi или /imt`.trim();
  }

  const bmi = bmiPresenter(calc(params));
  const gender = params.userInfo.gender === 'male' ? 'Мужчина' : 'Женщина';

  return `
${gender}, ${params.userInfo.height} см, ${params.weight} кг.

${bmi}
`.trim();
}
