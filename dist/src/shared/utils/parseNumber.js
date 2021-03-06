"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.minus = exports.roundUp = exports.roundDown = exports.roundToTwo = exports.parseNumber = void 0;
const big_js_1 = __importDefault(require("big.js"));
function parseNumber(str) {
    const prepared = str
        .replace(',', '.') // формат с запятой вместо точки "70,23"
        .replace(/[−‒–—―]/g, '-'); // символы типа дефиса
    const reFloat = /-?\d+(\.\d+)?/;
    const found = reFloat.exec(prepared); // используем exec чтобы получить только первое совпадение
    if (found == null)
        return null;
    const num = found[0];
    return roundToTwo(parseFloat(num));
}
exports.parseNumber = parseNumber;
/**
 * Округляет с точностью 2 знака после запятой
 */
function roundToTwo(num, dp = 2) {
    // prettier-ignore
    return parseFloat(big_js_1.default(num).toFixed(dp));
}
exports.roundToTwo = roundToTwo;
function round(num, roundingMode, dp = 2) {
    // prettier-ignore
    return parseFloat(big_js_1.default(num).round(dp, roundingMode).toFixed(dp));
}
function roundDown(num, dp = 2) {
    return round(num, 0, dp);
}
exports.roundDown = roundDown;
function roundUp(num, dp = 2) {
    return round(num, 3, dp);
}
exports.roundUp = roundUp;
// Вычитание: current - other
function minus(current, other) {
    return roundToTwo(big_js_1.default(current).minus(other));
}
exports.minus = minus;
//# sourceMappingURL=parseNumber.js.map