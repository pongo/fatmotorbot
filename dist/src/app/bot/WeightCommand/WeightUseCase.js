"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("src/app/shared/errors");
const measureDifference_1 = require("src/app/shared/measureDifference");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const result_1 = require("src/shared/utils/result");
class WeightUseCase {
    constructor(weightRepository) {
        this.weightRepository = weightRepository;
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
        const currentMeasure = { date, value: weight };
        const diff = measureDifference_1.measureDifference(currentMeasure, previousMeasuresResult.value);
        return result_1.Result.ok({ diff, weight, kind: 'add' });
    }
    async getCurrent(userId, now) {
        console.log(`WeightUseCase.getCurrent(${userId}, new Date('${now.toISOString()}');`);
        const measuresResult = await this.weightRepository.getAll(userId);
        if (measuresResult.isErr)
            return measuresResult;
        const measures = measuresResult.value;
        if (measures.length === 0)
            return result_1.Result.ok({ kind: 'current' });
        const current = measures[0];
        const diff = measureDifference_1.measureDifference(current, measures, now);
        return result_1.Result.ok({ diff, current, kind: 'current' });
    }
}
exports.WeightUseCase = WeightUseCase;
function validateWeight(value) {
    if (value !== null && value >= 1 && value <= 500)
        return value;
    return null;
}
exports.validateWeight = validateWeight;
//# sourceMappingURL=WeightUseCase.js.map