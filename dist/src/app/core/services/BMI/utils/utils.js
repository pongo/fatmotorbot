"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcBMICoeff = exports.calcBMIValue = void 0;
const parseNumber_1 = require("src/shared/utils/parseNumber");
function calcBMIValue(height, weight) {
    const bmi = (weight * 1.3) / calcBMICoeff(height);
    return parseNumber_1.roundToTwo(bmi);
}
exports.calcBMIValue = calcBMIValue;
function calcBMICoeff(height) {
    return (((height / 100) * height) / 100) * Math.sqrt(height / 100);
}
exports.calcBMICoeff = calcBMICoeff;
//# sourceMappingURL=utils.js.map