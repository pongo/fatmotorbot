"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseNumber_1 = require("src/shared/utils/parseNumber");
function calcBMICoeff(height) {
    return (((height / 100) * height) / 100) * Math.sqrt(height / 100);
}
function calcBMI(height, weight) {
    const bmi = (weight * 1.3) / calcBMICoeff(height);
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
function getHealthyRange(gender, height) {
    const [lowerBMI, upperBMI] = gender === 'male' ? [20, 25] : [19, 24];
    const coeff = calcBMICoeff(height);
    const targetLower = (lowerBMI / 1.3) * coeff;
    const targetUpper = (upperBMI / 1.3) * coeff;
    return [parseNumber_1.roundToTwo(targetLower), parseNumber_1.roundToTwo(targetUpper)];
}
exports.getHealthyRange = getHealthyRange;
//# sourceMappingURL=BMI.js.map