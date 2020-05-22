"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBot = void 0;
const CheckCommandController_1 = require("src/app/bot/CheckCommand/CheckCommandController");
const InfoCommandController_1 = require("src/app/bot/InfoCommand/InfoCommandController");
const WeightCommandController_1 = require("src/app/bot/WeightCommand/WeightCommandController");
function initBot(telegram, infoRepository, weightRepository, chartDomain) {
    const infoCommandController = new InfoCommandController_1.InfoCommandController(telegram, infoRepository, weightRepository);
    const weightCommandController = new WeightCommandController_1.WeightCommandController(telegram, weightRepository, infoRepository, chartDomain);
    const checkCommandController = new CheckCommandController_1.CheckCommandController(telegram);
    [infoCommandController, weightCommandController, checkCommandController].forEach((c) => c.enable());
    telegram.onStartCommand(`Команды:\n\n/weight 45.5 — добавляет вес.\n/weight — предыдущие замеры.`);
    return { infoCommandController, weightCommandController, checkCommandController };
}
exports.initBot = initBot;
//# sourceMappingURL=bot.js.map