"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcBMIFromUserInfo = exports.calcBMIFromWeight = exports.calcBMI = exports.getSuggestedWeightDiff = exports.GetBMIUseCase = exports.calcBMICoeff = exports.calcBMIValue = void 0;
const BMICategory_1 = require("src/app/core/services/BMI/utils/BMICategory");
const IdealWeight_1 = require("src/app/core/services/IdealWeight");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const result_1 = require("src/shared/utils/result");
function calcBMIValue(height, weight) {
    const bmi = (weight * 1.3) / calcBMICoeff(height);
    return parseNumber_1.roundToTwo(bmi);
}
exports.calcBMIValue = calcBMIValue;
function calcBMICoeff(height) {
    return (((height / 100) * height) / 100) * Math.sqrt(height / 100);
}
exports.calcBMICoeff = calcBMICoeff;
class GetBMIUseCase {
    constructor(infoRepository, weightRepository) {
        this.infoRepository = infoRepository;
        this.weightRepository = weightRepository;
    }
    async get(userId, data = {}) {
        const { weight, userInfo } = data;
        if (userInfo == null && weight != null)
            return calcBMIFromWeight(userId, weight, this.infoRepository);
        if (weight == null && userInfo != null)
            return calcBMIFromUserInfo(userId, userInfo, this.weightRepository);
        if (weight == null || userInfo == null)
            throw Error('weight and userInfo should be defined');
        return result_1.Result.ok(calcBMI(weight, userInfo));
    }
}
exports.GetBMIUseCase = GetBMIUseCase;
function getSuggestedWeightDiff(gender, height, weight) {
    const bmi = calcBMIValue(height, weight);
    const category = BMICategory_1.getBMICategory(gender, bmi);
    return category.getSuggest(gender, height, weight);
}
exports.getSuggestedWeightDiff = getSuggestedWeightDiff;
function calcBMI(weight, { gender, height }) {
    const bmi = calcBMIValue(height, weight);
    return {
        case: 'bmi',
        bmi,
        categoryName: BMICategory_1.getBMICategoryName(gender, bmi),
        healthyRange: BMICategory_1.getHealthyRange(gender, height),
        suggest: getSuggestedWeightDiff(gender, height, weight),
        ideal: IdealWeight_1.calcIdealWeight(height, gender),
    };
}
exports.calcBMI = calcBMI;
async function calcBMIFromWeight(userId, weight, infoRepository) {
    const infoResult = await infoRepository.get(userId);
    if (infoResult.isErr)
        return infoResult;
    if (infoResult.value == null)
        return result_1.Result.ok({ case: 'need-user-info' });
    const userInfo = infoResult.value;
    return result_1.Result.ok(calcBMI(weight, userInfo));
}
exports.calcBMIFromWeight = calcBMIFromWeight;
async function calcBMIFromUserInfo(userId, userInfo, weightRepository) {
    const weightResult = await weightRepository.getCurrent(userId);
    if (weightResult.isErr)
        return weightResult;
    if (weightResult.value == null)
        return result_1.Result.ok({ case: 'need-user-weight' });
    const weight = weightResult.value;
    return result_1.Result.ok(calcBMI(weight, userInfo));
}
exports.calcBMIFromUserInfo = calcBMIFromUserInfo;
//# sourceMappingURL=BMI.js.map