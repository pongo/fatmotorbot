"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StacklessError = void 0;
class StacklessError {
    constructor(message, data) {
        this.message = message;
        this.data = data;
        this.name = 'StacklessError';
    }
}
exports.StacklessError = StacklessError;
require('util').inherits(StacklessError, Error);
//# sourceMappingURL=StacklessError.js.map