"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StacklessError_1 = require("src/shared/utils/StacklessError");
exports.Result = {
    ok,
    err,
    combine,
    unwrap,
};
function ok(value) {
    return {
        isOk: true,
        isErr: false,
        value: value,
    };
}
function err(error, data) {
    return {
        isOk: false,
        isErr: true,
        error: typeof error === 'string' ? new StacklessError_1.StacklessError(error, data) : error,
    };
}
function combine(results) {
    for (const result of results) {
        if (result.isErr)
            return result;
    }
    return exports.Result.ok(results.map(result => result.value));
}
function unwrap(result) {
    if (result.isErr)
        throw result.error;
    return result.value;
}
//# sourceMappingURL=result.js.map