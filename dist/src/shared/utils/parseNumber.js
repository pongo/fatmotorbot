"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    return Math.round((num + Number.EPSILON) * 100) / 100;
}
exports.roundToTwo = roundToTwo;
//# sourceMappingURL=parseNumber.js.map