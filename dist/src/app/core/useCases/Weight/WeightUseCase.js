"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("src/app/shared/errors");
const measureDifference_1 = require("src/app/shared/measureDifference");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const result_1 = require("src/shared/utils/result");
class WeightUseCase {
    constructor(weightRepository, bmiUseCase) {
        this.weightRepository = weightRepository;
        this.bmiUseCase = bmiUseCase;
    }
    async add(userId, date, weightString) {
        console.log(`WeightUseCase.add(${userId}, new Date('${date.toISOString()}'), \`${weightString}\`);`);
        const weight = validateWeight(parseNumber_1.parseNumber(weightString));
        if (weight == null)
            return result_1.Result.err(new errors_1.InvalidFormatError());
        const previousMeasuresResult = await this.weightRepository.getAll(userId);
        if (previousMeasuresResult.isErr)
            return previousMeasuresResult;
        const addResult = await this.weightRepository.add(userId, weight, date);
        if (addResult.isErr)
            return addResult;
        const bmi = await this.bmiUseCase.get(userId, { weight });
        const previousMeasures = previousMeasuresResult.value;
        if (previousMeasures.length === 0)
            return result_1.Result.ok({ case: "add:first", weight, bmi });
        const diff = measureDifference_1.measureDifference({ date, value: weight }, previousMeasures);
        return result_1.Result.ok({ case: "add:diff", diff, weight, bmi });
    }
    async getCurrent(userId, now) {
        console.debug(`WeightUseCase.getCurrent(${userId}, new Date('${now.toISOString()}');`);
        const measuresResult = await this.weightRepository.getAll(userId);
        if (measuresResult.isErr)
            return measuresResult;
        const measures = measuresResult.value;
        if (measures.length === 0)
            return result_1.Result.ok({ case: "current:empty" });
        const current = measures[0];
        const bmi = await this.bmiUseCase.get(userId, { weight: current.value });
        if (measures.length === 1)
            return result_1.Result.ok({ case: "current:first", current, bmi });
        const diff = measureDifference_1.measureDifference(current, measures, now);
        return result_1.Result.ok({ case: "current:diff", diff, current, bmi });
    }
}
exports.WeightUseCase = WeightUseCase;
function validateWeight(value) {
    if (value !== null && value >= 1 && value <= 999)
        return value;
    return null;
}
exports.validateWeight = validateWeight;
//# sourceMappingURL=WeightUseCase.js.map