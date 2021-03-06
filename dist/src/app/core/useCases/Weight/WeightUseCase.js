"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightUseCase = void 0;
const BMI_1 = require("src/app/core/services/BMI/BMI");
const measureDifference_1 = require("src/app/core/services/measureDifference");
const validators_1 = require("src/app/core/services/validators");
const prepareDataForChart_1 = require("src/app/core/useCases/Weight/prepareDataForChart");
const errors_1 = require("src/app/shared/errors");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const result_1 = require("src/shared/utils/result");
class WeightUseCase {
    constructor(weightRepository, infoRepository) {
        this.weightRepository = weightRepository;
        this.infoRepository = infoRepository;
    }
    async add(userId, date, weightString) {
        console.log(`WeightUseCase.add(${userId}, new Date('${date.toISOString()}'), \`${weightString}\`);`);
        const weight = validators_1.validateWeight(parseNumber_1.parseNumber(weightString));
        if (weight == null)
            return result_1.Result.err(new errors_1.InvalidFormatError());
        const previousMeasuresResult = await this.weightRepository.getAll(userId);
        if (previousMeasuresResult.isErr)
            return previousMeasuresResult;
        const addResult = await this.weightRepository.add(userId, weight, date);
        if (addResult.isErr)
            return addResult;
        const bmi = await BMI_1.calcBMIFromWeight(userId, weight, this.infoRepository);
        const previousMeasures = previousMeasuresResult.value;
        if (previousMeasures.length === 0)
            return result_1.Result.ok({ case: "add:first" /* addFirst */, weight, bmi });
        const diff = measureDifference_1.measureDifference({ date, value: weight }, previousMeasures);
        const chart = await this.getDataForChart(userId, { bmiResult: bmi });
        return result_1.Result.ok({ case: "add:diff" /* addDiff */, diff, weight, bmi, chart });
    }
    async getCurrent(userId, now) {
        console.debug(`WeightUseCase.getCurrent(${userId}, new Date('${now.toISOString()}');`);
        const measuresResult = await this.weightRepository.getAll(userId);
        if (measuresResult.isErr)
            return measuresResult;
        const measures = measuresResult.value;
        if (measures.length === 0)
            return result_1.Result.ok({ case: "current:empty" /* currentEmpty */ });
        const current = measures[0];
        const bmi = await BMI_1.calcBMIFromWeight(userId, current.value, this.infoRepository);
        if (measures.length === 1)
            return result_1.Result.ok({ case: "current:first" /* currentFirst */, current, bmi });
        const diff = measureDifference_1.measureDifference(current, measures, now);
        const chart = await this.getDataForChart(userId, { measuresResult, bmiResult: bmi });
        return result_1.Result.ok({ case: "current:diff" /* currentDiff */, diff, current, bmi, chart });
    }
    async getDataForChart(userId, { measuresResult, bmiResult }) {
        console.debug(`WeightUseCase.getDataForChart(${userId});`);
        const _measuresResult = measuresResult !== null && measuresResult !== void 0 ? measuresResult : (await this.weightRepository.getAll(userId));
        if (_measuresResult.isErr)
            return undefined;
        const measures = _measuresResult.value;
        if (measures.length === 0)
            return undefined;
        const bmi = getBMIValue(bmiResult);
        return prepareDataForChart_1.prepareDataForChart(userId, measures, bmi);
    }
}
exports.WeightUseCase = WeightUseCase;
function getBMIValue(bmiResult) {
    if (bmiResult.isErr)
        return undefined;
    if (bmiResult.value.case !== 'bmi')
        return undefined;
    return bmiResult.value;
}
//# sourceMappingURL=WeightUseCase.js.map