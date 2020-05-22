import { CheckCommandController } from 'src/app/bot/CheckCommand/CheckCommandController';
import { InfoCommandController } from 'src/app/bot/InfoCommand/InfoCommandController';
import { WeightCommandController } from 'src/app/bot/WeightCommand/WeightCommandController';
import { InfoRepository } from 'src/app/core/repositories/InfoRepository';
import { WeightRepository } from 'src/app/core/repositories/WeightRepository';
import { ITelegramGateway } from 'src/shared/infrastructure/TelegramGateway';

export function initBot(
  telegram: ITelegramGateway,
  infoRepository: InfoRepository,
  weightRepository: WeightRepository,
  chartDomain?: string,
) {
  const infoCommandController = new InfoCommandController(telegram, infoRepository, weightRepository);
  const weightCommandController = new WeightCommandController(telegram, weightRepository, infoRepository, chartDomain);
  const checkCommandController = new CheckCommandController(telegram);
  [infoCommandController, weightCommandController, checkCommandController].forEach((c) => c.enable());

  telegram.onStartCommand(`Команды:\n\n/weight 45.5 — добавляет вес.\n/weight — предыдущие замеры.`);

  return { infoCommandController, weightCommandController, checkCommandController };
}
