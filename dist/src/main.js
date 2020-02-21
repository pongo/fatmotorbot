"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias')({ base: process.cwd() });
const InfoCommandController_1 = require("src/app/bot/InfoCommandController");
const WeightCommandController_1 = require("src/app/bot/WeightCommandController");
const InfoRepository_1 = require("src/app/core/Info/InfoRepository");
const WeightRepository_1 = require("src/app/core/Weight/WeightRepository");
const config_1 = require("src/config");
const createDB_1 = require("src/shared/infrastructure/createDB");
const TelegramGateway_1 = require("src/shared/infrastructure/TelegramGateway");
async function main() {
    const config = config_1.parseConfig();
    const db = createDB_1.createDB(config.DATABASE_URL);
    const telegram = new TelegramGateway_1.TelegramGateway(config.BOT_TOKEN);
    const infoRepository = new InfoRepository_1.InfoRepository(db);
    const weightRepository = new WeightRepository_1.WeightRepository(db);
    new InfoCommandController_1.InfoCommandController(telegram, infoRepository, weightRepository).enable();
    new WeightCommandController_1.WeightCommandController(telegram, weightRepository, infoRepository).enable();
    telegram.onStartCommand(`Команды:\n\n/weight 45.5 — добавляет вес.\n/weight — предыдущие замеры.`);
    await telegram.connect({
        domain: config.BOT_WEBHOOK_DOMAIN,
        webhookPath: config.BOT_WEBHOOK_PATH,
        port: config.PORT,
    });
    console.log('Bot started');
}
main().catch(console.error);
//# sourceMappingURL=main.js.map