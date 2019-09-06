"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slonik_1 = require("slonik");
const errors_1 = require("src/app/shared/errors");
function infoPresenter(result) {
    if (result.isErr)
        return presentError(result.error);
    if (result.value.case === 'get:none')
        return presentNoData();
    if (result.value.case === 'get')
        return presentUserData(result.value.data);
    return presentSetData(result.value.data);
}
exports.infoPresenter = infoPresenter;
function presentNoData() {
    return `
Укажи свои данные командой: /info {пол} {рост}, где:
• {пол} — м или ж
• {рост в см} — 185

Пример: /info ж 164
`.trim();
}
function presentError(error) {
    if (error instanceof errors_1.InvalidFormatError)
        return 'Не могу разобрать твои каракули. Пиши точно как я указал';
    if (error instanceof slonik_1.SlonikError)
        return 'Что-то не так с базой данных. Вызывайте техподдержку!';
    return 'Ошибочная ошибка';
}
function presentUserData(data) {
    const gender = data.gender === 'female' ? 'Женщина' : 'Мужчина';
    return `${gender}, ${data.height} см`;
}
function presentSetData(data) {
    return `Сохранил твои данные: ${presentUserData(data).toLowerCase()}`;
}
//# sourceMappingURL=infoPresenter.js.map