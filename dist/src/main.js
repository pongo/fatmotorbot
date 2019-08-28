"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
const createDB_1 = require("src/shared/infrastructure/createDB");
const TelegramGateway_1 = require("src/shared/infrastructure/TelegramGateway");
const config_1 = require("./config");
async function main() {
    const config = config_1.parseConfig();
    const db = createDB_1.createDB(config.DATABASE_URL);
    const telegram = new TelegramGateway_1.TelegramGateway(config.BOT_TOKEN);
    telegram.onCommand('hi', async (command) => {
        await telegram.sendMessage(command.chatId, 'hello', command.messageId);
    });
    await telegram.connect({
        domain: config.BOT_WEBHOOK_DOMAIN,
        webhookPath: config.BOT_WEBHOOK_PATH,
        port: config.PORT,
    });
    console.log('Bot started');
}
main();
//# sourceMappingURL=main.js.map