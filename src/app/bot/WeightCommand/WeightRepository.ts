import { Kg, TelegramUserId } from 'src/app/shared/modelTypes';

export interface IWeightRepository {
  add(userId: TelegramUserId, weight: Kg): Promise<void>;
}

export class WeightRepository {}
