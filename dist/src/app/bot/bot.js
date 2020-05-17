"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBot = void 0;
const CheckCommandController_1 = require("src/app/bot/CheckCommand/CheckCommandController");
const InfoCommandController_1 = require("src/app/bot/InfoCommand/InfoCommandController");
const WeightCommandController_1 = require("src/app/bot/WeightCommand/WeightCommandController");
function initBot(telegram, infoRepository, weightRepository, chartDomain) {
    new InfoCommandController_1.InfoCommandController(telegram, infoRepository, weightRepository).enable();
    new WeightCommandController_1.WeightCommandController(telegram, weightRepository, infoRepository, chartDomain).enable();
    new CheckCommandController_1.CheckCommandController(telegram).enable();
    telegram.onStartCommand(`Команды:\n\n/weight 45.5 — добавляет вес.\n/weight — предыдущие замеры.`);
}
exports.initBot = initBot;
//# sourceMappingURL=bot.js.map