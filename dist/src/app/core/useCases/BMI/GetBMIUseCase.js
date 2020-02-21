"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BMI_1 = require("src/app/core/useCases/BMI/utils/BMI");
const BMICategory_1 = require("src/app/core/useCases/BMI/utils/BMICategory");
const IdealWeight_1 = require("src/app/shared/IdealWeight");
const result_1 = require("src/shared/utils/result");
class GetBMIUseCase {
    constructor(infoUseCase) {
        this.infoUseCase = infoUseCase;
    }
    async get(userId, weight) {
        const infoResult = await this.infoUseCase.get(userId);
        if (infoResult.isErr)
            return infoResult;
        if (infoResult.value.case === 'get:no-user-info')
            return result_1.Result.ok({ case: 'need-user-info' });
        const result = calcBMIResult(weight, infoResult.value.data);
        return result_1.Result.ok(result);
    }
}
exports.GetBMIUseCase = GetBMIUseCase;
function getSuggestedWeightDiff(gender, height, weight) {
    const bmi = BMI_1.calcBMI(height, weight);
    const category = BMICategory_1.getBMICategory(gender, bmi);
    return category.getSuggest(gender, height, weight);
}
exports.getSuggestedWeightDiff = getSuggestedWeightDiff;
function calcBMIResult(weight, { gender, height }) {
    const bmi = BMI_1.calcBMI(height, weight);
    return {
        case: 'bmi',
        bmi,
        categoryName: BMICategory_1.getBMICategoryName(gender, bmi),
        healthyRange: BMICategory_1.getHealthyRange(gender, height),
        suggest: getSuggestedWeightDiff(gender, height, weight),
        ideal: IdealWeight_1.calcIdealWeight(height, gender),
    };
}
//# sourceMappingURL=GetBMIUseCase.js.map