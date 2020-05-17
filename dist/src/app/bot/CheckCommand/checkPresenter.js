"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.present = void 0;
const bmiPresenter_1 = require("src/app/bot/presenters/bmiPresenter");
const result_1 = require("src/shared/utils/result");
const HELP = `
Укажи данные командой: /check пол рост вес, где:
• пол — м или ж
• рост в см
• вес в кг

Пример: /check ж 164 45
Альтернатива: /bmi или /imt`.trim();
function present(result) {
    if (result.isErr)
        return HELP;
    const { bmiResult, params } = result.value;
    const bmi = bmiPresenter_1.bmiPresenter(result_1.Result.ok(bmiResult));
    const gender = params.userInfo.gender === 'male' ? 'Мужчина' : 'Женщина';
    return `
${gender}, ${params.userInfo.height} см, ${params.weight} кг.

${bmi}
`.trim();
}
exports.present = present;
//# sourceMappingURL=checkPresenter.js.map