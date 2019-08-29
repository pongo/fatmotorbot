"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StacklessError_1 = require("../../shared/utils/StacklessError");
class InvalidFormatError extends StacklessError_1.StacklessError {
    constructor() {
        super('InvalidFormatError');
        this.name = 'InvalidFormatError';
    }
}
exports.InvalidFormatError = InvalidFormatError;
//# sourceMappingURL=errors.js.map