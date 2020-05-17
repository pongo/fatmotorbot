"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = exports.InfoUseCase = void 0;
const BMI_1 = require("src/app/core/services/BMI/BMI");
const errors_1 = require("src/app/shared/errors");
const validators_1 = require("src/app/core/services/validators");
const result_1 = require("src/shared/utils/result");
class InfoUseCase {
    constructor(infoRepository, weightRepository) {
        this.infoRepository = infoRepository;
        this.weightRepository = weightRepository;
        this.bmiUseCase = new BMI_1.GetBMIUseCase(this, weightRepository);
    }
    async get(userId) {
        console.debug(`InfoUseCase.get(${userId});`);
        const result = await this.infoRepository.get(userId);
        if (result.isErr)
            return result;
        if (result.value == null)
            return result_1.Result.ok({ case: 'get:no-user-info' });
        return result_1.Result.ok({ case: 'get', data: result.value });
    }
    async set(userId, args) {
        console.log(`InfoUseCase.add(${userId}, [${args}]);`);
        const data = validateData(args);
        if (data == null)
            return result_1.Result.err(new errors_1.InvalidFormatError());
        const addResult = await this.infoRepository.set(userId, data);
        if (addResult.isErr)
            return addResult;
        const bmiResult = await this.bmiUseCase.get(userId, { userInfo: data });
        const bmi = bmiResult.isErr ? null : bmiResult.value;
        return result_1.Result.ok({ case: 'set', data, bmi });
    }
}
exports.InfoUseCase = InfoUseCase;
function validateData(args) {
    if (args.length < 2)
        return null;
    const [genderStr, heightStr] = args;
    const gender = validators_1.validateGender(genderStr);
    const height = validators_1.validateHeight(heightStr);
    if (gender == null || height == null)
        return null;
    return { gender, height };
}
exports.validateData = validateData;
//# sourceMappingURL=InfoUseCase.js.map