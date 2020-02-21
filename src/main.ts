/* eslint-disable import/first,@typescript-eslint/no-var-requires */
/* tslint:disable:no-require-imports no-submodule-imports no-unsafe-any */
require('module-alias')({ base: process.cwd() });
// ...
import { InfoCommandController } from 'src/app/bot/InfoCommandController';
import { WeightCommandController } from 'src/app/bot/WeightCommandController';
import { InfoRepository } from 'src/app/core/Info/InfoRepository';
import { InfoUseCase } from 'src/app/core/Info/InfoUseCase';
import { WeightRepository } from 'src/app/core/Weight/WeightRepository';
import { createDB } from 'src/shared/infrastructure/createDB';
import { TelegramGateway } from 'src/shared/infrastructure/TelegramGateway';
import { parseConfig } from './config';

async function main() {
  const config = parseConfig();
  const db = createDB(config.DATABASE_URL);
  const telegram = new TelegramGateway(config.BOT_TOKEN);

  const infoRepository = new InfoRepository(db);
  const weightRepository = new WeightRepository(db);
  const infoUseCase = new InfoUseCase(infoRepository, weightRepository);
  new InfoCommandController(infoUseCase, telegram).enable();
  new WeightCommandController(weightRepository, telegram, infoUseCase).enable();

  telegram.onStartCommand(`Команды:\n\n/weight 45.5 — добавляет вес.\n/weight — предыдущие замеры.`);

  await telegram.connect({
    domain: config.BOT_WEBHOOK_DOMAIN,
    webhookPath: config.BOT_WEBHOOK_PATH,
    port: config.PORT,
  });
  console.log('Bot started');
}

main(); // tslint:disable-line:no-floating-promises
