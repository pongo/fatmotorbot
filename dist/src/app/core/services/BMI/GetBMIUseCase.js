"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcBMIResult = exports.getSuggestedWeightDiff = exports.calcBMICoeff = exports.calcBMI = exports.GetBMIUseCase = void 0;
const BMICategory_1 = require("src/app/core/services/BMI/utils/BMICategory");
const IdealWeight_1 = require("src/app/core/services/IdealWeight");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const result_1 = require("src/shared/utils/result");
class GetBMIUseCase {
    constructor(infoUseCase, weightRepository) {
        this.infoUseCase = infoUseCase;
        this.weightRepository = weightRepository;
    }
    async get(userId, data = {}) {
        let weight;
        let userInfo;
        if (data.userInfo == null) {
            const infoResult = await this.infoUseCase.get(userId);
            if (infoResult.isErr)
                return infoResult;
            if (infoResult.value.case === 'get:no-user-info')
                return result_1.Result.ok({ case: 'need-user-info' });
            userInfo = infoResult.value.data;
        }
        else {
            userInfo = data.userInfo;
        }
        if (data.weight == null) {
            const weightResult = await this.weightRepository.getCurrent(userId);
            if (weightResult.isErr)
                return weightResult;
            if (weightResult.value == null)
                return result_1.Result.ok({ case: 'need-user-weight' });
            weight = weightResult.value;
        }
        else {
            weight = data.weight;
        }
        return result_1.Result.ok(calcBMIResult(weight, userInfo));
    }
}
exports.GetBMIUseCase = GetBMIUseCase;
function calcBMI(height, weight) {
    const bmi = (weight * 1.3) / calcBMICoeff(height);
    return parseNumber_1.roundToTwo(bmi);
}
exports.calcBMI = calcBMI;
function calcBMICoeff(height) {
    return (((height / 100) * height) / 100) * Math.sqrt(height / 100);
}
exports.calcBMICoeff = calcBMICoeff;
function getSuggestedWeightDiff(gender, height, weight) {
    const bmi = calcBMI(height, weight);
    const category = BMICategory_1.getBMICategory(gender, bmi);
    return category.getSuggest(gender, height, weight);
}
exports.getSuggestedWeightDiff = getSuggestedWeightDiff;
function calcBMIResult(weight, { gender, height }) {
    const bmi = calcBMI(height, weight);
    return {
        case: 'bmi',
        bmi,
        categoryName: BMICategory_1.getBMICategoryName(gender, bmi),
        healthyRange: BMICategory_1.getHealthyRange(gender, height),
        suggest: getSuggestedWeightDiff(gender, height, weight),
        ideal: IdealWeight_1.calcIdealWeight(height, gender),
    };
}
exports.calcBMIResult = calcBMIResult;
//# sourceMappingURL=GetBMIUseCase.js.map