"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bmiPresenter_1 = require("src/app/bot/bmiPresenter");
const errors_1 = require("src/app/shared/errors");
const result_1 = require("src/shared/utils/result");
function infoPresenter(result) {
    if (result.isErr)
        return presentError(result.error);
    if (result.value.case === 'get:no-user-info')
        return presentNoData();
    if (result.value.case === 'get')
        return presentUserData(result.value.data);
    return presentSetData(result.value.data, result.value.bmi);
}
exports.infoPresenter = infoPresenter;
function presentNoData() {
    return `
Укажи свои данные командой: /info пол рост, где:
• пол — м или ж
• рост в см — 185

Пример: /info ж 164
`.trim();
}
function presentError(error) {
    if (error instanceof errors_1.InvalidFormatError)
        return 'Не могу разобрать твои каракули. Пиши точно как я указал';
    if (error instanceof errors_1.DatabaseError)
        return 'Что-то не так с базой данных. Вызывайте техподдержку!';
    return 'Ошибочная ошибка';
}
function presentUserData(data) {
    const gender = data.gender === 'female' ? 'Женщина' : 'Мужчина';
    return `${gender}, ${data.height} см`;
}
function presentSetData(data, bmi) {
    const bmiText = bmi == null ? '' : `.\n\n${bmiPresenter_1.bmiPresenter(result_1.Result.ok(bmi))}`;
    return `Сохранил твои данные: ${presentUserData(data).toLowerCase()}${bmiText}`;
}
//# sourceMappingURL=infoPresenter.js.map