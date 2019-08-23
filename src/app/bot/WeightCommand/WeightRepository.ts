import { Kg, Measure, TelegramUserId } from 'src/app/shared/types';

export interface IWeightRepository {
  add(userId: TelegramUserId, weight: Kg): Promise<void>;
  getAll(userId: TelegramUserId): Promise<Measure<Kg>[]>;
}

export class WeightRepository {}
