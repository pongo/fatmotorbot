import { Kg, Measure, TelegramUserId } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

export interface IWeightRepository {
  add(userId: TelegramUserId, weight: Kg): Promise<Result>;
  getAll(userId: TelegramUserId): Promise<Result<Measure<Kg>[]>>;
}

export class WeightRepository {}

// TODO: не забыть, что add() должен отправлять запрос через очередь
