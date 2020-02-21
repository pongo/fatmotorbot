"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BMI_1 = require("src/app/core/BMI/BMI");
const BMICalc_1 = require("src/app/core/BMI/BMICalc");
const BMICategory_1 = require("src/app/core/BMI/BMICategory");
const IdealWeight_1 = require("src/app/core/BMI/IdealWeight");
function calcBMIResult(weight, { gender, height }) {
    const bmi = BMICalc_1.calcBMI(height, weight);
    return {
        case: 'bmi',
        bmi,
        categoryName: BMICategory_1.getBMICategoryName(gender, bmi),
        healthyRange: BMICategory_1.getHealthyRange(gender, height),
        suggest: BMI_1.getSuggestedWeightDiff(gender, height, weight),
        ideal: IdealWeight_1.calcIdealWeight(height, gender),
    };
}
exports.calcBMIResult = calcBMIResult;
//# sourceMappingURL=calcBMIResult.js.map