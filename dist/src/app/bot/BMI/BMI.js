"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const big_js_1 = __importDefault(require("big.js"));
const parseNumber_1 = require("src/shared/utils/parseNumber");
function calcBMI(height, weight) {
    const bHeight = big_js_1.default(height);
    const part1 = big_js_1.default(weight).mul(1.3);
    const part2 = bHeight.div(100).mul(bHeight).div(100).mul(bHeight.div(100).sqrt());
    const bmi = part1.div(part2);
    return parseNumber_1.roundToTwo(bmi);
}
exports.calcBMI = calcBMI;
function getBMICategory(gender, bmi) {
    if (bmi < 15)
        return 'Very severely underweight';
    return gender === 'male' ? getMaleBMICategory(bmi) : getFemaleBMICategory(bmi);
}
exports.getBMICategory = getBMICategory;
function getFemaleBMICategory(bmi) {
    if (bmi < 16)
        return 'Severely underweight';
    if (bmi < 19)
        return 'Underweight';
    if (bmi < 24)
        return 'Normal';
    return getGenericBMICategory(bmi);
}
function getMaleBMICategory(bmi) {
    if (bmi < 18)
        return 'Severely underweight';
    if (bmi < 20)
        return 'Underweight';
    if (bmi < 25)
        return 'Normal';
    return getGenericBMICategory(bmi);
}
function getGenericBMICategory(bmi) {
    if (bmi < 30)
        return 'Overweight';
    if (bmi < 35)
        return 'Obese I';
    if (bmi < 40)
        return 'Obese II';
    if (bmi < 45)
        return 'Obese III';
    if (bmi < 50)
        return 'Obese IV';
    if (bmi < 60)
        return 'Obese V';
    return 'Obese VI+';
}
//# sourceMappingURL=BMI.js.map