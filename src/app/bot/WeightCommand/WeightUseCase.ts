import { SlonikError } from 'slonik';
import { IWeightRepository } from 'src/app/bot/WeightCommand/WeightRepository';
import { InvalidFormatError } from 'src/app/shared/errors';
import { measureDifference, MeasureDifferenceSummary } from 'src/app/shared/measureDifference';
import { Kg, Measure, TelegramUserId } from 'src/app/shared/types';
import { parseNumber } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

export const enum WeightCases {
  addFirst = 'add:first',
  addDiff = 'add:diff',
  currentEmpty = 'current:empty',
  currentFirst = 'current:first',
  currentDiff = 'current:diff',
}

export type WeightAdded = WeightAddedFirst | WeightAddedDiff;

export type WeightAddedFirst = {
  case: WeightCases.addFirst;
  weight: Kg;
};

export type WeightAddedDiff = {
  case: WeightCases.addDiff;
  diff: MeasureDifferenceSummary<Kg>;
  weight: Kg;
};

type WeightAddedErrors = InvalidFormatError | SlonikError;

export type CurrentWeight = CurrentWeightEmpty | CurrentWeightFirst | CurrentWeightDiff;

export type CurrentWeightEmpty = {
  case: WeightCases.currentEmpty;
};

export type CurrentWeightFirst = {
  case: WeightCases.currentFirst;
  current: Measure<Kg>;
};

export type CurrentWeightDiff = {
  case: WeightCases.currentDiff;
  current: Measure<Kg>;
  diff: MeasureDifferenceSummary<Kg>;
};

export class WeightUseCase {
  constructor(private readonly weightRepository: IWeightRepository) {}

  async add(userId: TelegramUserId, date: Date, weightString: string): Promise<Result<WeightAdded, WeightAddedErrors>> {
    console.log(`WeightUseCase.add(${userId}, new Date('${date.toISOString()}'), \`${weightString}\`);`);

    const weight = validateWeight(parseNumber(weightString));
    if (weight == null) return Result.err(new InvalidFormatError());

    const previousMeasuresResult = await this.weightRepository.getAll(userId);
    if (previousMeasuresResult.isErr) return previousMeasuresResult;
    const addResult = await this.weightRepository.add(userId, weight, date);
    if (addResult.isErr) return addResult;

    if (previousMeasuresResult.value.length === 0) return Result.ok({ case: WeightCases.addFirst, weight });

    const diff = measureDifference({ date, value: weight }, previousMeasuresResult.value);
    return Result.ok({ case: WeightCases.addDiff, diff, weight });
  }

  async getCurrent(userId: TelegramUserId, now: Date): Promise<Result<CurrentWeight, SlonikError>> {
    console.log(`WeightUseCase.getCurrent(${userId}, new Date('${now.toISOString()}');`);

    const measuresResult = await this.weightRepository.getAll(userId);
    if (measuresResult.isErr) return measuresResult;

    const measures = measuresResult.value;
    if (measures.length === 0) return Result.ok({ case: WeightCases.currentEmpty });

    const current = measures[0];
    if (measures.length === 1) return Result.ok({ case: WeightCases.currentFirst, current });

    const diff = measureDifference(current, measures, now);
    return Result.ok({ case: WeightCases.currentDiff, diff, current });
  }
}

/**
 * Проверяет правильно ли указан вес.
 */
export function validateWeight(value: number | null): Kg | null {
  if (value !== null && value >= 1 && value <= 999) return value as Kg;
  return null;
}
