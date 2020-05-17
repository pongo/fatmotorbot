import { UserInfo } from 'src/app/core/repositories/InfoRepository';
import { calcBMI } from 'src/app/core/services/BMI/BMI';
import { BMIResult } from 'src/app/core/services/BMI/utils/types';
import { InvalidFormatError } from 'src/app/shared/errors';
import { Kg } from 'src/app/shared/types';
import { validateGender, validateHeight, validateWeight } from 'src/app/core/services/validators';
import { parseNumber } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

type CheckParams = {
  weight: Kg;
  userInfo: UserInfo;
};

function validate(args: string[]): CheckParams | null {
  if (args.length !== 3) return null;

  const [genderStr, heightStr, weightStr] = args;
  const gender = validateGender(genderStr);
  const height = validateHeight(heightStr);
  const weight = validateWeight(parseNumber(weightStr));
  if (gender == null || height == null || weight == null) return null;

  return { weight, userInfo: { gender, height } };
}

type CheckedData = { params: CheckParams; bmiResult: BMIResult };
export type CheckResult = Result<CheckedData, InvalidFormatError>;

export function checkUseCase(args: string[]): CheckResult {
  const params = validate(args);
  if (params === null) return Result.err(new InvalidFormatError());

  return Result.ok({ params, bmiResult: calcBMI(params.weight, params.userInfo) });
}
