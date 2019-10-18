"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const big_js_1 = __importDefault(require("big.js"));
const BMICalc_1 = require("src/app/bot/BMI/BMICalc");
const parseNumber_1 = require("src/shared/utils/parseNumber");
class BMICategory {
    constructor({ name, position, lowerBMI, upperBMI }) {
        this.name = name;
        this.position = position;
        this.lowerBMI = lowerBMI;
        this.upperBMI = upperBMI;
    }
    static getHealthyRange(gender, height) {
        const normal = BMICategory.categories.get(0);
        if (normal == null)
            throw Error('normal category not found');
        return normal.getRangeWeight(gender, height);
    }
    inRange(gender, bmi) {
        return bmi >= this.lowerBMI[gender] && bmi < this.upperBMI[gender];
    }
    getRangeWeight(gender, height) {
        const [lowerBMI, upperBMI] = this.getRangeBMI(gender);
        const coeff = BMICalc_1.calcBMICoeff(height);
        const lower = (lowerBMI / 1.3) * coeff;
        const upper = ((upperBMI - 0.01) / 1.3) * coeff;
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
        const [healthyLower, healthyUpper] = BMICategory.getHealthyRange(gender, height);
        const healthyWeight = this.position < 0 ? healthyLower : healthyUpper;
        return roundUpKg(big_js_1.default(healthyWeight).minus(weight));
    }
    toNext(gender, height, weight) {
        if (this.position === -1 || this.position === 1)
            return null;
        const nextPosition = this.position < 0 ? this.position + 1 : this.position - 1;
        const next = BMICategory.categories.get(nextPosition);
        if (next == null) {
            throw new Error(`next should be defined. ${JSON.stringify({ gender, height, weight, name: this.name })}`);
        }
        const [lower, upper] = next.getRangeWeight(gender, height).map(roundUpKg);
        const nextWeight = this.position < 0 ? lower : upper;
        const diff = roundUpKg(big_js_1.default(nextWeight).minus(weight));
        return {
            categoryName: next.name,
            diff,
        };
    }
}
exports.BMICategory = BMICategory;
BMICategory.categories = new Map();
function addCategories() {
    const names = [
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
    let pos = -3;
    let lower = [-Infinity, -Infinity];
    for (const [name, upper] of names) {
        addCategory(pos, name, lower, upper);
        lower = upper;
        pos += 1;
    }
    function addCategory(position, name, lowerBMI, upperBMI) {
        BMICategory.categories.set(position, new BMICategory({
            name,
            position,
            lowerBMI: { female: lowerBMI[0], male: lowerBMI[1] },
            upperBMI: { female: upperBMI[0], male: upperBMI[1] },
        }));
    }
}
function getBMICategoryName(gender, bmi) {
    return getBMICategory(gender, bmi).name;
}
exports.getBMICategoryName = getBMICategoryName;
function getBMICategory(gender, bmi) {
    for (const cat of BMICategory.categories.values()) {
        if (cat.inRange(gender, bmi))
            return cat;
    }
    throw Error(`BMI category not found. gender: "${gender}", bmi: "${bmi}"`);
}
exports.getBMICategory = getBMICategory;
function getHealthyRange(gender, height) {
    return BMICategory.getHealthyRange(gender, height);
}
exports.getHealthyRange = getHealthyRange;
function roundUpKg(value) {
    return parseInt(big_js_1.default(value).round(0, 3).toFixed(), 10);
}
addCategories();
//# sourceMappingURL=BMICategory.js.map