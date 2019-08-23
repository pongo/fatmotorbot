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
    return Math.round(parseFloat(num) * 100) / 100;
}
exports.parseNumber = parseNumber;
//# sourceMappingURL=parseNumber.js.map