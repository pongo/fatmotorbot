"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoCommandController = void 0;
const presentGetInfo_1 = require("src/app/bot/InfoCommand/presenters/presentGetInfo");
const presentSetInfo_1 = require("src/app/bot/InfoCommand/presenters/presentSetInfo");
const InfoUseCase_1 = require("src/app/core/useCases/Info/InfoUseCase");
class InfoCommandController {
    constructor(telegram, infoRepository, weightRepository) {
        this.telegram = telegram;
        this.usecase = new InfoUseCase_1.InfoUseCase(infoRepository, weightRepository);
    }
    enable() {
        this.telegram.onCommand('info', this.handleInfo.bind(this));
    }
    async handleInfo(command) {
        const userId = command.from.id;
        const msg = command.argsText.length === 0
            ? presentGetInfo_1.presentGetInfo(await this.usecase.get(userId))
            : presentSetInfo_1.presentSetInfo(await this.usecase.set(userId, command.args));
        await this.telegram.sendMessage(command.chatId, msg, command.messageId);
    }
}
exports.InfoCommandController = InfoCommandController;
//# sourceMappingURL=InfoCommandController.js.map