import { Kg, Measure, TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export type MeasuresFromNewestToOldest<T extends number> = Measure<T>[];

export interface IWeightRepository {
  add(userId: TelegramUserId, weight: Kg): Promise<Result>;
  getAll(userId: TelegramUserId): Promise<Result<MeasuresFromNewestToOldest<Kg>>>;
}

export class WeightRepository {}

// TODO: не забыть, что add() должен отправлять запрос через очередь
