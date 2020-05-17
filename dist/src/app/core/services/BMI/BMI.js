"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcBMIFromUserInfo = exports.calcBMIFromWeight = exports.calcBMI = void 0;
const BMICategory_1 = require("src/app/core/services/BMI/utils/BMICategory");
const utils_1 = require("src/app/core/services/BMI/utils/utils");
const IdealWeight_1 = require("src/app/core/services/IdealWeight");
const result_1 = require("src/shared/utils/result");
function calcBMI(weight, { gender, height }) {
    const bmi = utils_1.calcBMIValue(height, weight);
    return {
        case: 'bmi',
        bmi,
        categoryName: BMICategory_1.getBMICategoryName(gender, bmi),
        healthyRange: BMICategory_1.getHealthyRange(gender, height),
        suggest: BMICategory_1.getSuggestedWeightDiff(gender, height, weight),
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