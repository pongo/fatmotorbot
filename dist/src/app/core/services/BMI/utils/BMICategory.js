"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestedWeightDiff = exports.getHealthyRange = exports.getBMICategory = exports.getBMICategoryName = exports.getBMICategoryByPosition = exports.BMICategory = void 0;
const big_js_1 = __importDefault(require("big.js"));
const utils_1 = require("src/app/core/services/BMI/utils/utils");
const assert_1 = require("src/shared/utils/assert");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const utils_2 = require("src/shared/utils/utils");
class BMICategory {
    constructor({ name, position, lowerBMI, upperBMI }) {
        this.name = name;
        this.position = position;
        this.lowerBMI = lowerBMI;
        this.upperBMI = upperBMI;
    }
    inRange(gender, bmi) {
        return bmi >= this.lowerBMI[gender] && bmi < this.upperBMI[gender];
    }
    getRangeWeight(gender, height) {
        const [lowerBMI, upperBMI] = this.getRangeBMI(gender);
        const MIN_WEIGHT = 1;
        const MAX_WEIGHT = 999;
        const coeff = utils_1.calcBMICoeff(height);
        const lower = Number.isFinite(lowerBMI) ? (lowerBMI / 1.3) * coeff : MIN_WEIGHT;
        const upper = Number.isFinite(upperBMI) ? ((upperBMI - 0.01) / 1.3) * coeff : MAX_WEIGHT; // у upperBMI не включительное сравнение, поэтому уменьшаем
        return [parseNumber_1.roundToTwo(lower), parseNumber_1.roundToTwo(upper)];
    }
    getSuggest(gender, height, weight) {
        if (this.name === 'Normal')
            return { alreadyHealthy: true };
        return {
            alreadyHealthy: false,
            toHealthy: this.toHealthy(gender, height, weight),
            toNext: this.toNext(gender, height, weight),
        };
    }
    getRangeBMI(gender) {
        return [this.lowerBMI[gender], this.upperBMI[gender]];
    }
    toHealthy(gender, height, weight) {
        const [healthyLower, healthyUpper] = getHealthyRange(gender, height);
        const healthyWeight = this.position < 0 ? healthyLower : healthyUpper;
        return roundUpKg(big_js_1.default(healthyWeight).minus(weight));
    }
    toNext(gender, height, weight) {
        if (this.position === -1 || this.position === 1)
            return null;
        const nextPosition = this.position < 0 ? this.position + 1 : this.position - 1;
        const next = getBMICategoryByPosition(nextPosition);
        /* istanbul ignore if */
        if (next == null) {
            throw new Error(`next should be defined. ${JSON.stringify({ gender, height, weight, name: this.name })}`);
        }
        const [lower, upper] = next.getRangeWeight(gender, height).map(roundUpKg);
        const nextWeight = this.position < 0 ? lower : upper;
        const diff = roundUpKg(big_js_1.default(nextWeight).minus(weight));
        return {
            categoryName: next.name,
            diff,
            nextWeight,
        };
    }
}
exports.BMICategory = BMICategory;
class BMICategories {
    constructor() {
        this.categories = new Map();
    }
    getByPosition(position) {
        this.checkCategories();
        return this.categories.get(position);
    }
    getByBMI(gender, bmi) {
        this.checkCategories();
        for (const cat of this.categories.values()) {
            if (cat.inRange(gender, bmi))
                return cat;
        }
        /* istanbul ignore next */
        throw Error(`BMI category not found. gender: "${gender}", bmi: "${bmi}"`);
    }
    getHealthyRange(gender, height) {
        this.checkCategories();
        const normal = this.categories.get(0);
        assert_1.assert(normal != null, 'the normal category not found');
        return normal.getRangeWeight(gender, height);
    }
    checkCategories() {
        addCategories(this.categories);
        this.checkCategories = utils_2.noop;
    }
}
function addCategories(categories) {
    const names = getNames();
    let pos = -3;
    let lower = [-Infinity, -Infinity];
    for (const [name, upper] of names) {
        addCategory(pos, name, lower, upper);
        lower = upper;
        pos += 1;
    }
    // eslint-disable-next-line max-params
    function addCategory(position, name, lowerBMI, upperBMI) {
        categories.set(position, new BMICategory({
            name,
            position,
            lowerBMI: { female: lowerBMI[0], male: lowerBMI[1] },
            upperBMI: { female: upperBMI[0], male: upperBMI[1] },
        }));
    }
    function getNames() {
        return [
            ['Very severely underweight', [15, 15]],
            ['Severely underweight', [16, 18]],
            ['Underweight', [19, 20]],
            ['Normal', [24, 25]],
            ['Overweight', [30, 30]],
            ['Obese I', [35, 35]],
            ['Obese II', [40, 40]],
            ['Obese III', [45, 45]],
            ['Obese IV', [50, 50]],
            ['Obese V', [60, 60]],
            ['Obese VI+', [Infinity, Infinity]],
        ];
    }
}
const bmiCategories = new BMICategories();
function getBMICategoryByPosition(position) {
    return bmiCategories.getByPosition(position);
}
exports.getBMICategoryByPosition = getBMICategoryByPosition;
function getBMICategoryName(gender, bmi) {
    return getBMICategory(gender, bmi).name;
}
exports.getBMICategoryName = getBMICategoryName;
function getBMICategory(gender, bmi) {
    return bmiCategories.getByBMI(gender, bmi);
}
exports.getBMICategory = getBMICategory;
function getHealthyRange(gender, height) {
    return bmiCategories.getHealthyRange(gender, height);
}
exports.getHealthyRange = getHealthyRange;
function roundUpKg(value) {
    // prettier-ignore
    return parseInt(big_js_1.default(value).round(0, 3 /* ROUND_UP */).toFixed(), 10);
}
function getSuggestedWeightDiff(gender, height, weight) {
    const bmi = utils_1.calcBMIValue(height, weight);
    const category = getBMICategory(gender, bmi);
    return category.getSuggest(gender, height, weight);
}
exports.getSuggestedWeightDiff = getSuggestedWeightDiff;
//# sourceMappingURL=BMICategory.js.map