"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const infoPresenter_1 = require("src/app/bot/InfoCommand/infoPresenter");
class InfoCommand {
    constructor(usecase, telegram) {
        this.usecase = usecase;
        this.telegram = telegram;
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
exports.InfoCommand = InfoCommand;
//# sourceMappingURL=InfoCommand.js.map