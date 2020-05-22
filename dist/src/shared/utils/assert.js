"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* tslint:disable:no-any */
const assert_1 = require("assert");
function assert(condition, message) {
    if (!condition) {
        throw new assert_1.AssertionError({ message });
    }
}
exports.assert = assert;
//# sourceMappingURL=assert.js.map