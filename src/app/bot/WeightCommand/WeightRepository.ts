import PQueue from 'p-queue';
import { DatabasePoolType, SlonikError, sql } from 'slonik';
import { Kg, Measure, TelegramUserId } from 'src/app/shared/types';
import { toTimestamp } from 'src/shared/infrastructure/createDB';
import { Result } from 'src/shared/utils/result';

export type MeasuresFromNewestToOldest<T extends number> = Measure<T>[];

export interface IWeightRepository {
  add(userId: TelegramUserId, weight: Kg, date: Date): Promise<Result>;
  getAll(userId: TelegramUserId): Promise<Result<MeasuresFromNewestToOldest<Kg>, SlonikError>>;
}

export class WeightRepository implements IWeightRepository {
  constructor(
    private readonly db: DatabasePoolType,
    private readonly writeQueue: PQueue = new PQueue({ concurrency: 1 }),
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async add(userId: TelegramUserId, weight: Kg, date: Date): Promise<Result<undefined, SlonikError>> {
    try {
      await this.writeQueue.add(async () => {
        return this.db.any(sql`
          INSERT INTO measures (user_id, value_type, value, date)
          VALUES (${userId}, 'weight', ${weight}, to_timestamp(${toTimestamp(date)}));
        `);
      });
      return Result.ok();
    } catch (error) {
      return Result.err(error);
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
    } catch (error) {
      return Result.err(error);
    }
  }
}
