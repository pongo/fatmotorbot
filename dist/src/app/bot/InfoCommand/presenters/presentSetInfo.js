"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presentSetInfo = void 0;
const bmiPresenter_1 = require("src/app/bot/presenters/bmiPresenter");
const shared_1 = require("src/app/bot/InfoCommand/presenters/shared");
const shared_2 = require("src/app/bot/presenters/shared");
const errors_1 = require("src/app/shared/errors");
const result_1 = require("src/shared/utils/result");
function presentSetInfo(result) {
    if (result.isErr)
        return presentError(result.error);
    return presentSetData(result.value.data, result.value.bmi);
}
exports.presentSetInfo = presentSetInfo;
function presentError(error) {
    if (error instanceof errors_1.InvalidFormatError)
        return 'Не могу разобрать твои каракули. Пиши точно как я указал';
    return shared_2.presentDatabaseError();
}
function presentSetData(data, bmi) {
    const bmiText = bmi == null ? '' : `.\n\n${bmiPresenter_1.bmiPresenter(result_1.Result.ok(bmi))}`;
    return `Сохранил твои данные: ${shared_1.presentUserData(data).toLowerCase()}${bmiText}`;
}
//# sourceMappingURL=presentSetInfo.js.map