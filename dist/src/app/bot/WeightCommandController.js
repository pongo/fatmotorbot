"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BMIUseCase_1 = require("src/app/core/BMI/BMIUseCase");
const InfoUseCase_1 = require("src/app/core/Info/InfoUseCase");
const weightPresenter_1 = require("src/app/core/Weight/weightPresenter");
const WeightUseCase_1 = require("src/app/core/Weight/WeightUseCase");
class WeightCommandController {
    constructor(telegram, weightRepository, infoRepository) {
        this.telegram = telegram;
        const infoUseCase = new InfoUseCase_1.InfoUseCase(infoRepository, weightRepository);
        const bmiUseCase = new BMIUseCase_1.BMIUseCase(infoUseCase);
        this.usecase = new WeightUseCase_1.WeightUseCase(weightRepository, bmiUseCase);
    }
    enable() {
        this.telegram.onCommand('weight', this.weightHandler.bind(this));
        this.telegram.onCommand('w', this.weightHandler.bind(this));
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
exports.WeightCommandController = WeightCommandController;
//# sourceMappingURL=WeightCommandController.js.map