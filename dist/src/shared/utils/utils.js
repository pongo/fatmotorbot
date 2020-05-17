"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = exports.toTimestamp = void 0;
function toTimestamp(date) {
    return Math.round(date.getTime() / 1000);
}
exports.toTimestamp = toTimestamp;
function noop() { }
exports.noop = noop;
//# sourceMappingURL=utils.js.map