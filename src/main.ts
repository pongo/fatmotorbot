/* eslint-disable import/first */
/* tslint:disable:no-require-imports no-submodule-imports */
require('module-alias/register');

import { createDB } from 'src/shared/infrastructure/createDB';
import { TelegramGateway } from 'src/shared/infrastructure/TelegramGateway';
import { parseConfig } from './config';

async function main() {
  const config = parseConfig();
  const db = createDB(config.DATABASE_URL);
  const telegram = new TelegramGateway(config.BOT_TOKEN);

  telegram.onCommand('hi', async command => {
    await telegram.sendMessage(command.chatId, 'hello', command.messageId);
  });

  await telegram.connect();
  console.log('Bot started');
}

main(); // tslint:disable-line:no-floating-promises
