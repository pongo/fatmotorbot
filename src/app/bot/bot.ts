import { InfoCommandController } from 'src/app/bot/InfoCommand/InfoCommandController';
import { WeightCommandController } from 'src/app/bot/WeightCommand/WeightCommandController';
import { InfoRepository } from 'src/app/core/repositories/InfoRepository';
import { WeightRepository } from 'src/app/core/repositories/WeightRepository';
import { TelegramGateway } from 'src/shared/infrastructure/TelegramGateway';

export function initBot(telegram: TelegramGateway, infoRepository: InfoRepository, weightRepository: WeightRepository, chartDomain?: string) {
  new InfoCommandController(telegram, infoRepository, weightRepository).enable();
  new WeightCommandController(telegram, weightRepository, infoRepository, chartDomain).enable();
  telegram.onStartCommand(`Команды:\n\n/weight 45.5 — добавляет вес.\n/weight — предыдущие замеры.`);
}
