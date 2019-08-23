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

export class WeightUseCase {
  constructor(private readonly weightRepository: IWeightRepository) {}

  async add(userId: TelegramUserId, date: Date, weightString: string): Promise<Result<WeightAdded>> {
    const weight = validateWeight(parseNumber(weightString));
    if (weight == null) return Result.err(new InvalidFormatError());

    const currentMeasure: Measure<Kg> = { date, value: weight };
    const previousMeasures = await this.weightRepository.getAll(userId);
    const diff = measureDifference(currentMeasure, previousMeasures);

    await this.weightRepository.add(userId, weight);
    return Result.ok({ diff, weight });
  }
}

/**
 * Проверяет правильно ли указан вес.
 */
export function validateWeight(value: number | null): Kg | null {
  if (value == null) return null;
  if (value >= 1 && value <= 500) return value as Kg;
  return null;
}
