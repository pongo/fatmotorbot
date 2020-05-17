"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckCommandController = void 0;
const checkCommand_1 = require("src/app/bot/CheckCommand/checkCommand");
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
        const msg = checkCommand_1.present(checkCommand_1.validate(command.args));
        await this.telegram.sendMessage(command.chatId, msg, command.messageId);
    }
}
exports.CheckCommandController = CheckCommandController;
//# sourceMappingURL=CheckCommandController.js.map