"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const big_js_1 = __importDefault(require("big.js"));
function parseNumber(str) {
    const prepared = str
        .replace(',', '.')
        .replace(/[−‒–—―]/g, '-');
    const reFloat = /-?\d+(\.\d+)?/;
    const found = reFloat.exec(prepared);
    if (found == null)
        return null;
    const num = found[0];
    return roundToTwo(parseFloat(num));
}
exports.parseNumber = parseNumber;
function roundToTwo(num) {
    return parseFloat(big_js_1.default(num).toFixed(2));
}
exports.roundToTwo = roundToTwo;
function minus(current, other) {
    return roundToTwo(big_js_1.default(current).minus(other));
}
exports.minus = minus;
//# sourceMappingURL=parseNumber.js.map