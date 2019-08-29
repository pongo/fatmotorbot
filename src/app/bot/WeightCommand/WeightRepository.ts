import { DatabasePoolType, SlonikError, sql } from 'slonik';
import { Result } from '../../../shared/utils/result';
import { toTimestamp } from '../../../shared/utils/utils';
import { Kg, Measure, MeasureValueType, TelegramUserId } from '../../shared/types';

export type MeasuresFromNewestToOldest<T extends number> = Measure<T>[];

export interface IWeightRepository {
  add(userId: TelegramUserId, weight: Kg, date: Date): Promise<Result>;
  getAll(userId: TelegramUserId): Promise<Result<MeasuresFromNewestToOldest<Kg>, SlonikError>>;
}

export class WeightRepository implements IWeightRepository {
  constructor(private readonly db: DatabasePoolType) {}

  async add(userId: TelegramUserId, weight: Kg, date: Date): Promise<Result<undefined, SlonikError>> {
    const valueType: MeasureValueType = 'weight';
    try {
      await this.db.any(sql`
        INSERT INTO measures (user_id, value_type, value, date)
        VALUES (${userId}, ${valueType}, ${weight}, to_timestamp(${toTimestamp(date)}));
      `);
      return Result.ok();
    } catch (e) {
      console.error('WeightRepository.add()', e);
      return Result.err(e);
    }
  }

  async getAll(userId: TelegramUserId): Promise<Result<MeasuresFromNewestToOldest<Kg>, SlonikError>> {
    try {
      const result = await this.db.any(sql`
        SELECT date, value
        FROM measures
        WHERE value_type = 'weight'
          AND user_id = ${userId}
        ORDER BY date DESC;
      `);
      // TODO: нужна ли здесь валидация?
      const measures = (result as unknown) as MeasuresFromNewestToOldest<Kg>;
      return Result.ok(measures);
    } catch (e) {
      console.error('WeightRepository.getAll()', e);
      return Result.err(e);
    }
  }
}
