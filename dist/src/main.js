"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias')({ base: process.cwd() });
const InfoCommand_1 = require("src/app/bot/InfoCommand/InfoCommand");
const InfoRepository_1 = require("src/app/bot/InfoCommand/InfoRepository");
const InfoUseCase_1 = require("src/app/bot/InfoCommand/InfoUseCase");
const WeightCommand_1 = require("src/app/bot/WeightCommand/WeightCommand");
const WeightRepository_1 = require("src/app/bot/WeightCommand/WeightRepository");
const createDB_1 = require("src/shared/infrastructure/createDB");
const TelegramGateway_1 = require("src/shared/infrastructure/TelegramGateway");
const config_1 = require("./config");
async function main() {
    const config = config_1.parseConfig();
    const db = createDB_1.createDB(config.DATABASE_URL);
    const telegram = new TelegramGateway_1.TelegramGateway(config.BOT_TOKEN);
    const infoRepository = new InfoRepository_1.InfoRepository(db);
    const weightRepository = new WeightRepository_1.WeightRepository(db);
    const infoUseCase = new InfoUseCase_1.InfoUseCase(infoRepository, weightRepository);
    new InfoCommand_1.InfoCommand(infoUseCase, telegram).enable();
    new WeightCommand_1.WeightCommand(weightRepository, telegram, infoUseCase).enable();
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