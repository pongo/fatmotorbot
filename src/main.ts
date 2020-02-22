/* eslint-disable import/first,@typescript-eslint/no-var-requires */
/* tslint:disable:no-require-imports no-submodule-imports no-unsafe-any */
require('module-alias')({ base: process.cwd() });
// ...
import { initBot } from 'src/app/bot/bot';
import { InfoRepository } from 'src/app/core/repositories/InfoRepository';
import { WeightRepository } from 'src/app/core/repositories/WeightRepository';
import { parseConfig } from 'src/config';
import { createDB } from 'src/shared/infrastructure/createDB';
import { TelegramGateway } from 'src/shared/infrastructure/TelegramGateway';

async function main() {
  const config = parseConfig();
  const db = createDB(config.DATABASE_URL);
  const telegram = new TelegramGateway(config.BOT_TOKEN);

  const infoRepository = new InfoRepository(db);
  const weightRepository = new WeightRepository(db);

  initBot(telegram, infoRepository, weightRepository);

  await telegram.connect({
    domain: config.BOT_WEBHOOK_DOMAIN,
    webhookPath: config.BOT_WEBHOOK_PATH,
    port: config.PORT,
  });
  console.log('Bot started');
}

main().catch(console.error);
