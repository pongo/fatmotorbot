import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import { IGetBMIUseCase } from 'src/app/core/useCases/BMI/GetBMIUseCase';
import { CurrentWeight, WeightAdded, WeightAddedErrors, WeightCases } from 'src/app/core/useCases/Weight/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { measureDifference } from 'src/app/shared/measureDifference';
import { Kg, TelegramUserId } from 'src/app/shared/types';
import { parseNumber } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

export class WeightUseCase {
  constructor(private readonly weightRepository: IWeightRepository, private readonly bmiUseCase: IGetBMIUseCase) {}

  async add(userId: TelegramUserId, date: Date, weightString: string): Promise<Result<WeightAdded, WeightAddedErrors>> {
    console.log(`WeightUseCase.add(${userId}, new Date('${date.toISOString()}'), \`${weightString}\`);`);

    const weight = validateWeight(parseNumber(weightString));
    if (weight == null) return Result.err(new InvalidFormatError());

    const previousMeasuresResult = await this.weightRepository.getAll(userId);
    if (previousMeasuresResult.isErr) return previousMeasuresResult;

    const addResult = await this.weightRepository.add(userId, weight, date);
    if (addResult.isErr) return addResult;

    const bmi = await this.bmiUseCase.get(userId, { weight });
    const previousMeasures = previousMeasuresResult.value;
    if (previousMeasures.length === 0) return Result.ok({ case: WeightCases.addFirst, weight, bmi });

    const diff = measureDifference({ date, value: weight }, previousMeasures);
    return Result.ok({ case: WeightCases.addDiff, diff, weight, bmi });
  }

  async getCurrent(userId: TelegramUserId, now: Date): Promise<Result<CurrentWeight, DatabaseError>> {
    console.debug(`WeightUseCase.getCurrent(${userId}, new Date('${now.toISOString()}');`);

    const measuresResult = await this.weightRepository.getAll(userId);
    if (measuresResult.isErr) return measuresResult;

    const measures = measuresResult.value;
    if (measures.length === 0) return Result.ok({ case: WeightCases.currentEmpty });

    const current = measures[0];
    const bmi = await this.bmiUseCase.get(userId, { weight: current.value });
    if (measures.length === 1) return Result.ok({ case: WeightCases.currentFirst, current, bmi });

    const diff = measureDifference(current, measures, now);
    return Result.ok({ case: WeightCases.currentDiff, diff, current, bmi });
  }
}

/**
 * Проверяет правильно ли указан вес.
 */
export function validateWeight(value: number | null): Kg | null {
  if (value !== null && value >= 1 && value <= 999) return value as Kg;
  return null;
}
