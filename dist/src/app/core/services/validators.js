"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateHeight = exports.validateGender = exports.validateWeight = void 0;
const parseNumber_1 = require("src/shared/utils/parseNumber");
function validateWeight(value) {
    if (value !== null && value >= 1 && value <= 999)
        return value;
    return null;
}
exports.validateWeight = validateWeight;
function validateGender(genderStr) {
    const lower = genderStr.toLowerCase();
    if (lower === 'м')
        return 'male';
    if (lower === 'ж')
        return 'female';
    return null;
}
exports.validateGender = validateGender;
function validateHeight(heightStr) {
    const value = parseNumber_1.parseNumber(heightStr);
    if (value != null && value >= 100 && value <= 300)
        return value;
    return null;
}
exports.validateHeight = validateHeight;
//# sourceMappingURL=validators.js.map