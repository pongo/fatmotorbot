"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weightPresenter_1 = require("src/app/bot/WeightCommand/weightPresenter");
const WeightUseCase_1 = require("src/app/bot/WeightCommand/WeightUseCase");
class WeightCommand {
    constructor(repository, telegram) {
        this.repository = repository;
        this.telegram = telegram;
        this.usecase = new WeightUseCase_1.WeightUseCase(this.repository);
    }
    enable() {
        this.telegram.onCommand('weight', this.weightHandler.bind(this));
    }
    async weightHandler(command) {
        const userId = command.from.id;
        const result = command.argsText.length === 0
            ? await this.usecase.getCurrent(userId, command.date)
            : await this.usecase.add(userId, command.date, command.argsText);
        const msg = weightPresenter_1.weightPresenter(result, command.date);
        await this.telegram.sendMessage(command.chatId, msg, command.messageId);
    }
}
exports.WeightCommand = WeightCommand;
//# sourceMappingURL=WeightCommand.js.map