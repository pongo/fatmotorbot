import { IWeightRepository } from 'src/app/bot/WeightCommand/WeightRepository';
import { InvalidFormatError } from 'src/app/shared/errors';
import { Kg, TelegramUserId } from 'src/app/shared/types';
import { parseNumber } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

export class WeightUseCase {
  constructor(private readonly weightRepository: IWeightRepository) {}

  async add(userId: TelegramUserId, weightString: string): Promise<Result<void>> {
    const weight = validateWeight(parseNumber(weightString));
    if (weight == null) return Result.err(new InvalidFormatError());

    await this.weightRepository.add(userId, weight);
    return Result.ok(undefined);
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
