/* eslint-disable import/first */
/* tslint:disable:no-require-imports no-submodule-imports */
require('module-alias/register');
//
import { WeightCommand } from 'src/app/bot/WeightCommand/WeightCommand';
import { WeightRepository } from 'src/app/bot/WeightCommand/WeightRepository';
import { createDB } from 'src/shared/infrastructure/createDB';
import { TelegramGateway } from 'src/shared/infrastructure/TelegramGateway';
import { parseConfig } from './config';

async function main() {
  const config = parseConfig();
  const db = createDB(config.DATABASE_URL);
  const telegram = new TelegramGateway(config.BOT_TOKEN);

  new WeightCommand(new WeightRepository(db), telegram).enable();

  telegram.onStartCommand(`Команды:\n\n/weight 45.5 — добавляет вес.\n/weight — предыдущие замеры.`);

  await telegram.connect({
    domain: config.BOT_WEBHOOK_DOMAIN,
    webhookPath: config.BOT_WEBHOOK_PATH,
    port: config.PORT,
  });
  console.log('Bot started');
}

main(); // tslint:disable-line:no-floating-promises
