"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bmiPresenter_1 = require("src/app/bot/presenters/bmiPresenter");
const shared_1 = require("src/app/bot/presenters/shared");
const shared_2 = require("src/app/bot/WeightCommand/presenters/shared");
const errors_1 = require("src/app/shared/errors");
function presentAddWeight(result, chartUrl) {
    if (result.isErr)
        return presentError(result.error);
    const data = result.value;
    if (data.case === "add:first")
        return presentAddFirst(data);
    return presentAddDiff(data, chartUrl);
}
exports.presentAddWeight = presentAddWeight;
function presentError(error) {
    if (error instanceof errors_1.InvalidFormatError)
        return 'Какой-какой у тебя вес?';
    return shared_1.presentDatabaseError();
}
function presentAddFirst({ weight, bmi }) {
    const header = shared_2.getHeader(weight);
    return `${header}Первый шаг сделан. Регулярно делай замеры, например, каждую пятницу утром.\n\n${bmiPresenter_1.bmiPresenter(bmi)}`;
}
function presentAddDiff({ diff, weight, bmi }, chartUrl) {
    const previous = shared_2.presentDiff(diff);
    return `${shared_2.getHeader(weight)}${previous}\n\n${bmiPresenter_1.bmiPresenter(bmi)}${shared_2.chartImage(chartUrl)}`;
}
//# sourceMappingURL=presentAddWeight.js.map