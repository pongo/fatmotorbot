"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BMI_1 = require("src/app/bot/BMI/BMI");
const IdealWeight_1 = require("src/app/bot/BMI/IdealWeight");
const result_1 = require("src/shared/utils/result");
class BMIUseCase {
    constructor(infoUseCase) {
        this.infoUseCase = infoUseCase;
    }
    async get(userId, weight) {
        const infoResult = await this.infoUseCase.get(userId);
        if (infoResult.isErr)
            return infoResult;
        if (infoResult.value.case === 'get:none')
            return result_1.Result.ok({ case: 'need-user-info' });
        const { gender, height } = infoResult.value.data;
        const bmi = BMI_1.calcBMI(height, weight);
        const result = {
            case: 'bmi',
            bmi,
            categoryName: BMI_1.getBMICategoryName(gender, bmi),
            healthyRange: BMI_1.getHealthyRange(gender, height),
            suggest: BMI_1.getSuggestedWeightDiff(gender, height, weight),
            ideal: IdealWeight_1.calcIdealWeight(height, gender),
        };
        return result_1.Result.ok(result);
    }
}
exports.BMIUseCase = BMIUseCase;
//# sourceMappingURL=BMIUseCase.js.map