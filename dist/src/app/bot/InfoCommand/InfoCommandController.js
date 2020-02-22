"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infoPresenter_1 = require("src/app/bot/InfoCommand/infoPresenter");
const InfoUseCase_1 = require("src/app/core/useCases/Info/InfoUseCase");
class InfoCommandController {
    constructor(telegram, infoRepository, weightRepository) {
        this.telegram = telegram;
        this.usecase = new InfoUseCase_1.InfoUseCase(infoRepository, weightRepository);
    }
    enable() {
        this.telegram.onCommand('info', this.infoHandler.bind(this));
    }
    async infoHandler(command) {
        const userId = command.from.id;
        const result = command.argsText.length === 0 ? await this.usecase.get(userId) : await this.usecase.set(userId, command.args);
        const msg = infoPresenter_1.infoPresenter(result);
        await this.telegram.sendMessage(command.chatId, msg, command.messageId);
    }
}
exports.InfoCommandController = InfoCommandController;
//# sourceMappingURL=InfoCommandController.js.map