import { IWeightRepository } from 'src/app/bot/WeightCommand/WeightRepository';
import { InvalidFormatError } from 'src/app/shared/errors';
import { measureDifference, MeasureDifferenceSummary } from 'src/app/shared/measureDifference';
import { Kg, Measure, TelegramUserId } from 'src/app/shared/types';
import { parseNumber } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

type WeightAdded = {
  diff: MeasureDifferenceSummary<Kg>;
  weight: Kg;
};

type WeightAddedErrors = InvalidFormatError | Error;

type CurrentWeight = {
  diff: MeasureDifferenceSummary<Kg>;
  weight: Kg | null;
};

export class WeightUseCase {
  constructor(private readonly weightRepository: IWeightRepository) {}

  async add(userId: TelegramUserId, date: Date, weightString: string): Promise<Result<WeightAdded, WeightAddedErrors>> {
    const weight = validateWeight(parseNumber(weightString));
    if (weight == null) return Result.err(new InvalidFormatError());

    const previousMeasuresResult = await this.weightRepository.getAll(userId);
    if (previousMeasuresResult.isErr) return previousMeasuresResult;

    const addResult = await this.weightRepository.add(userId, weight);
    if (addResult.isErr) return addResult;

    const currentMeasure: Measure<Kg> = { date, value: weight };
    const diff = measureDifference(currentMeasure, previousMeasuresResult.value);
    return Result.ok({ diff, weight });
  }

  async getCurrent(userId: TelegramUserId, now: Date): Promise<Result<CurrentWeight>> {
    const measuresResult = await this.weightRepository.getAll(userId);
    if (measuresResult.isErr) return measuresResult;

    const measures = measuresResult.value;
    if (measures.length === 0) return Result.ok({ diff: {}, weight: null });

    const currentMeasure = measures[0];
    if (measures.length === 1) return Result.ok({ diff: {}, weight: currentMeasure.value});

    const diff = measureDifference(currentMeasure, measures, now);
    return Result.ok({ diff, weight: currentMeasure.value });
  }
}

/**
 * Проверяет правильно ли указан вес.
 */
export function validateWeight(value: number | null): Kg | null {
  if (value !== null && value >= 1 && value <= 500) return value as Kg;
  return null;
}
