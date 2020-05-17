"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckCommandController = void 0;
const checkPresenter_1 = require("src/app/bot/CheckCommand/checkPresenter");
const checkUseCase_1 = require("src/app/core/useCases/checkUseCase");
class CheckCommandController {
    constructor(telegram) {
        this.telegram = telegram;
    }
    enable() {
        this.telegram.onCommand('check', this.handleCheck.bind(this));
        this.telegram.onCommand('bmi', this.handleCheck.bind(this));
        this.telegram.onCommand('imt', this.handleCheck.bind(this));
    }
    async handleCheck(command) {
        const msg = checkPresenter_1.present(checkUseCase_1.checkUseCase(command.args));
        await this.telegram.sendMessage(command.chatId, msg, command.messageId);
    }
}
exports.CheckCommandController = CheckCommandController;
//# sourceMappingURL=CheckCommandController.js.map