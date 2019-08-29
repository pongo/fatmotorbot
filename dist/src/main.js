"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WeightCommand_1 = require("./app/bot/WeightCommand/WeightCommand");
const WeightRepository_1 = require("./app/bot/WeightCommand/WeightRepository");
const config_1 = require("./config");
const createDB_1 = require("./shared/infrastructure/createDB");
const TelegramGateway_1 = require("./shared/infrastructure/TelegramGateway");
async function main() {
    const config = config_1.parseConfig();
    const db = createDB_1.createDB(config.DATABASE_URL);
    const telegram = new TelegramGateway_1.TelegramGateway(config.BOT_TOKEN);
    new WeightCommand_1.WeightCommand(new WeightRepository_1.WeightRepository(db), telegram).enable();
    telegram.onStartCommand(`Команды:\n\n/weight 45.5 — добавляет вес.\n/weight — предыдущие замеры.`);
    await telegram.connect({
        domain: config.BOT_WEBHOOK_DOMAIN,
        webhookPath: config.BOT_WEBHOOK_PATH,
        port: config.PORT,
    });
    console.log('Bot started');
}
main();
//# sourceMappingURL=main.js.map