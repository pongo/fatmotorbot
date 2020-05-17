"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUseCase = void 0;
const GetBMIUseCase_1 = require("src/app/core/useCases/BMI/GetBMIUseCase");
const errors_1 = require("src/app/shared/errors");
const validators_1 = require("src/app/shared/validators");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const result_1 = require("src/shared/utils/result");
function validate(args) {
    if (args.length !== 3)
        return null;
    const [genderStr, heightStr, weightStr] = args;
    const gender = validators_1.validateGender(genderStr);
    const height = validators_1.validateHeight(heightStr);
    const weight = validators_1.validateWeight(parseNumber_1.parseNumber(weightStr));
    if (gender == null || height == null || weight == null)
        return null;
    return { weight, userInfo: { gender, height } };
}
function checkUseCase(args) {
    const params = validate(args);
    if (params === null)
        return result_1.Result.err(new errors_1.InvalidFormatError());
    return result_1.Result.ok({ params, bmiResult: GetBMIUseCase_1.calcBMIResult(params.weight, params.userInfo) });
}
exports.checkUseCase = checkUseCase;
//# sourceMappingURL=checkUseCase.js.map