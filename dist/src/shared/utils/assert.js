"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = void 0;
const assert_1 = require("assert");
function assert(condition, message) {
    if (!condition) {
        throw new assert_1.AssertionError({ message });
    }
}
exports.assert = assert;
//# sourceMappingURL=assert.js.map