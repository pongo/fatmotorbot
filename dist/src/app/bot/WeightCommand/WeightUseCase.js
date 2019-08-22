"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("src/app/shared/errors");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const result_1 = require("src/shared/utils/result");
class WeightUseCase {
    constructor(weightRepository) {
        this.weightRepository = weightRepository;
    }
    async add(userId, weightString) {
        const weight = validateWeight(parseNumber_1.parseNumber(weightString));
        if (weight == null)
            return result_1.Result.err(new errors_1.InvalidFormatError());
        await this.weightRepository.add(userId, weight);
        return result_1.Result.ok(undefined);
    }
}
exports.WeightUseCase = WeightUseCase;
function validateWeight(value) {
    if (value == null)
        return null;
    if (value >= 1 && value <= 500)
        return value;
    return null;
}
exports.validateWeight = validateWeight;
//# sourceMappingURL=WeightUseCase.js.map