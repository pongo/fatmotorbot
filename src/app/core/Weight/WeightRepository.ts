import { DatabasePoolType, SlonikError, sql } from 'slonik';
import { Kg, Measure, MeasureValueType, TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { toTimestamp } from 'src/shared/utils/utils';

export type MeasuresFromNewestToOldest<T extends number> = Measure<T>[];

export interface IWeightRepositoryGetCurrent {
  getCurrent(userId: TelegramUserId): Promise<Result<Kg | null, SlonikError>>;
}

export interface IWeightRepository extends IWeightRepositoryGetCurrent {
  add(userId: TelegramUserId, weight: Kg, date: Date): Promise<Result>;
  getAll(userId: TelegramUserId): Promise<Result<MeasuresFromNewestToOldest<Kg>, SlonikError>>;
}

const weightValueType: MeasureValueType = 'weight';

export class WeightRepository implements IWeightRepository {
  constructor(private readonly db: DatabasePoolType) {}

  async add(userId: TelegramUserId, weight: Kg, date: Date): Promise<Result<undefined, SlonikError>> {
    try {
      await this.db.any(sql`
        INSERT INTO measures (user_id, value_type, value, date)
        VALUES (${userId}, ${weightValueType}, ${weight}, to_timestamp(${toTimestamp(date)}));
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
        WHERE value_type = ${weightValueType}
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

  async getCurrent(userId: TelegramUserId): Promise<Result<Kg | null, SlonikError>> {
    try {
      const result = await this.db.maybeOne(sql`
        SELECT value
        FROM measures
        WHERE value_type = ${weightValueType}
          AND user_id = ${userId}
        ORDER BY date DESC
        LIMIT 1;
      `);
      const current = result == null ? result : result.value as Kg;
      return Result.ok(current);
    } catch (e) {
      console.error('WeightRepository.getCurrent()', e);
      return Result.err(e);
    }
  }
}
