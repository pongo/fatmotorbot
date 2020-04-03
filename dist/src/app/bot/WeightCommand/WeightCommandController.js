"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const presentAddWeight_1 = require("src/app/bot/WeightCommand/presenters/presentAddWeight");
const presentCurrentWeight_1 = require("src/app/bot/WeightCommand/presenters/presentCurrentWeight");
const GetBMIUseCase_1 = require("src/app/core/useCases/BMI/GetBMIUseCase");
const InfoUseCase_1 = require("src/app/core/useCases/Info/InfoUseCase");
const WeightUseCase_1 = require("src/app/core/useCases/Weight/WeightUseCase");
class WeightCommandController {
    constructor(telegram, weightRepository, infoRepository, chartDomain) {
        this.telegram = telegram;
        this.chartDomain = chartDomain;
        const infoUseCase = new InfoUseCase_1.InfoUseCase(infoRepository, weightRepository);
        const bmiUseCase = new GetBMIUseCase_1.GetBMIUseCase(infoUseCase, weightRepository);
        this.usecase = new WeightUseCase_1.WeightUseCase(weightRepository, bmiUseCase);
    }
    enable() {
        this.telegram.onCommand('weight', this.weightHandler.bind(this));
        this.telegram.onCommand('w', this.weightHandler.bind(this));
    }
    async weightHandler(command) {
        const userId = command.from.id;
        const msg = command.argsText.length === 0
            ? await _current(this.usecase, this.chartDomain)
            : await _add(this.usecase, this.chartDomain);
        await this.telegram.sendMessage(command.chatId, msg, command.messageId);
        async function _current(usecase, chartDomain) {
            const result = await usecase.getCurrent(userId, command.date);
            const chartUrl = await presentCurrentWeight_1.getCurrentChartUrl(result, chartDomain);
            return presentCurrentWeight_1.presentCurrentWeight(result, command.date, chartUrl);
        }
        async function _add(usecase, chartDomain) {
            const result = await usecase.add(userId, command.date, command.argsText);
            const chartUrl = await presentAddWeight_1.getAddChartUrl(result, chartDomain);
            return presentAddWeight_1.presentAddWeight(result, chartUrl);
        }
    }
}
exports.WeightCommandController = WeightCommandController;
//# sourceMappingURL=WeightCommandController.js.map