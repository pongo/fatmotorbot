"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presentGetInfo = void 0;
const shared_1 = require("src/app/bot/InfoCommand/presenters/shared");
const shared_2 = require("src/app/bot/presenters/shared");
function presentGetInfo(result) {
    if (result.isErr)
        return shared_2.presentDatabaseError();
    if (result.value.case === 'get:no-user-info')
        return presentNoData();
    return shared_1.presentUserData(result.value.data);
}
exports.presentGetInfo = presentGetInfo;
function presentNoData() {
    return `
Укажи свои данные командой: /info пол рост, где:
• пол — м или ж
• рост в см — 185

Пример: /info ж 164
`.trim();
}
//# sourceMappingURL=presentGetInfo.js.map