"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bmiPresenter_1 = require("src/app/bot/presenters/bmiPresenter");
const GetBMIUseCase_1 = require("src/app/core/useCases/BMI/GetBMIUseCase");
const validators_1 = require("src/app/shared/validators");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const result_1 = require("src/shared/utils/result");
function validate(args) {
    if (args.length !== 3)
        return null;
    const [genderStr, heightStr, weightStr] = args;
    const gender = validators_1.validateGender(genderStr);
    const height = validators_1.validateHeight(heightStr);
    const weight = validators_1.validateWeight(parseNumber_1.parseNumber(weightStr));
    if (gender == null || height == null || weight == null)
        return null;
    return { weight, userInfo: { gender, height } };
}
exports.validate = validate;
function calc(params) {
    return result_1.Result.ok(GetBMIUseCase_1.calcBMIResult(params.weight, params.userInfo));
}
function present(params) {
    if (params === null) {
        return `
Укажи данные командой: /check пол рост вес, где:
• пол — м или ж
• рост в см
• вес в кг

Пример: /check ж 164 45
Альтернатива: /bmi или /imt`.trim();
    }
    const bmi = bmiPresenter_1.bmiPresenter(calc(params));
    const gender = params.userInfo.gender === 'male' ? 'Мужчина' : 'Женщина';
    return `
${gender}, ${params.userInfo.height} см, ${params.weight} кг.

${bmi}
`.trim();
}
exports.present = present;
//# sourceMappingURL=checkCommand.js.map