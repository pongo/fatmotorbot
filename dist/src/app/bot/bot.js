"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InfoCommandController_1 = require("src/app/bot/InfoCommand/InfoCommandController");
const WeightCommandController_1 = require("src/app/bot/WeightCommand/WeightCommandController");
function initBot(telegram, infoRepository, weightRepository) {
    new InfoCommandController_1.InfoCommandController(telegram, infoRepository, weightRepository).enable();
    new WeightCommandController_1.WeightCommandController(telegram, weightRepository, infoRepository).enable();
    telegram.onStartCommand(`Команды:\n\n/weight 45.5 — добавляет вес.\n/weight — предыдущие замеры.`);
}
exports.initBot = initBot;
//# sourceMappingURL=bot.js.map