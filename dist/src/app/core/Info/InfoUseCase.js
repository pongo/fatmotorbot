"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BMIUseCase_1 = require("src/app/core/BMI/BMIUseCase");
const WeightUseCase_1 = require("src/app/core/Weight/WeightUseCase");
const errors_1 = require("src/app/shared/errors");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const result_1 = require("src/shared/utils/result");
class InfoUseCase {
    constructor(infoRepository, weightRepository) {
        this.infoRepository = infoRepository;
        this.weightRepository = weightRepository;
        const bmiUseCase = new BMIUseCase_1.BMIUseCase(this);
        this.weightUseCase = new WeightUseCase_1.WeightUseCase(weightRepository, bmiUseCase);
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
        const weightResult = await this.weightUseCase.getCurrent(userId, new Date());
        const bmi = getBmiFromResult();
        return result_1.Result.ok({ case: 'set', data, bmi });
        function getBmiFromResult() {
            if (weightResult.isErr)
                return null;
            if (weightResult.value.case === "current:empty")
                return null;
            const bmiResult = weightResult.value.bmi;
            if (bmiResult.isErr)
                return null;
            return bmiResult.value;
        }
    }
}
exports.InfoUseCase = InfoUseCase;
function validateData(args) {
    if (args.length < 2)
        return null;
    const [genderStr, heightStr] = args;
    const gender = validateGender();
    const height = validateHeight();
    if (gender == null || height == null)
        return null;
    return { gender, height };
    function validateGender() {
        const lower = genderStr.toLowerCase();
        if (lower === 'м')
            return 'male';
        if (lower === 'ж')
            return 'female';
        return null;
    }
    function validateHeight() {
        const value = parseNumber_1.parseNumber(heightStr);
        if (value != null && value >= 100 && value <= 300)
            return value;
        return null;
    }
}
exports.validateData = validateData;
//# sourceMappingURL=InfoUseCase.js.map