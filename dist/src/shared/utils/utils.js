"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = exports.toTimestamp = void 0;
function toTimestamp(date) {
    return Math.round(date.getTime() / 1000); // https://github.com/gajus/slonik/issues/70
}
exports.toTimestamp = toTimestamp;
// eslint-disable-next-line
function noop() { }
exports.noop = noop;
//# sourceMappingURL=utils.js.map