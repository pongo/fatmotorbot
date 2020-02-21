"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calcBMIResult_1 = require("src/app/core/BMI/calcBMIResult");
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
        const result = calcBMIResult_1.calcBMIResult(weight, infoResult.value.data);
        return result_1.Result.ok(result);
    }
}
exports.BMIUseCase = BMIUseCase;
//# sourceMappingURL=BMIUseCase.js.map