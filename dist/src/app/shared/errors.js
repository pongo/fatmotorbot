"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StacklessError_1 = require("src/shared/utils/StacklessError");
class InvalidFormatError extends StacklessError_1.StacklessError {
    constructor() {
        super('InvalidFormatError');
        this.name = 'InvalidFormatError';
    }
}
exports.InvalidFormatError = InvalidFormatError;
class DatabaseError extends StacklessError_1.StacklessError {
    constructor(slonikError) {
        super('DatabaseError');
        this.slonikError = slonikError;
        this.name = 'DatabaseError';
        this.message = slonikError.message;
    }
}
exports.DatabaseError = DatabaseError;
//# sourceMappingURL=errors.js.map