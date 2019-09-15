"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BMICategory_1 = require("src/app/bot/BMI/BMICategory");
const BMICalc_1 = require("./BMICalc");
function getSuggestedWeightDiff(gender, height, weight) {
    const bmi = BMICalc_1.calcBMI(height, weight);
    const category = BMICategory_1.getBMICategory(gender, bmi);
    return category.getSuggest(gender, height, weight);
}
exports.getSuggestedWeightDiff = getSuggestedWeightDiff;
var BMICalc_2 = require("./BMICalc");
exports.calcBMI = BMICalc_2.calcBMI;
var BMICategory_2 = require("./BMICategory");
exports.getBMICategoryName = BMICategory_2.getBMICategoryName;
exports.getHealthyRange = BMICategory_2.getHealthyRange;
//# sourceMappingURL=BMI.js.map