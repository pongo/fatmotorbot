"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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