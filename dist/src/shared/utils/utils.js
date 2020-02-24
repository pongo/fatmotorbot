"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
exports.isEmptyObject = isEmptyObject;
function toTimestamp(date) {
    return Math.round(date.getTime() / 1000);
}
exports.toTimestamp = toTimestamp;
function noop() { }
exports.noop = noop;
//# sourceMappingURL=utils.js.map