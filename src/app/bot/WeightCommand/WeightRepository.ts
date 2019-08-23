import { Kg, TelegramUserId } from 'src/app/shared/types';

export interface IWeightRepository {
  add(userId: TelegramUserId, weight: Kg): Promise<void>;
}

export class WeightRepository {}
