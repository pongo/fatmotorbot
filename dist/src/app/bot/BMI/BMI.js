"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const big_js_1 = __importDefault(require("big.js"));
const parseNumber_1 = require("src/shared/utils/parseNumber");
function calcBMI(height, weight) {
    const bmi = (weight * 1.3) / calcBMICoeff(height);
    return parseNumber_1.roundToTwo(bmi);
}
exports.calcBMI = calcBMI;
function calcBMICoeff(height) {
    return (((height / 100) * height) / 100) * Math.sqrt(height / 100);
}
const categories = new Map();
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
        const coeff = calcBMICoeff(height);
        const lower = (lowerBMI / 1.3) * coeff;
        const upper = (upperBMI / 1.3) * coeff;
        return [roundUp(lower), roundUp(upper)];
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
        return roundUp(big_js_1.default(healthyWeight).minus(weight));
    }
    toNext(gender, height, weight) {
        if (this.position === -1 || this.position === 1)
            return null;
        const nextPosition = this.position < 0 ? this.position + 1 : this.position - 1;
        const next = categories.get(nextPosition);
        if (next == null) {
            throw new Error(`next should be defined. ${JSON.stringify({ gender, height, weight, name: this.name })}`);
        }
        const [lower, upper] = next.getRangeWeight(gender, height);
        const nextWeight = this.position < 0 ? lower : upper;
        const diff = roundUp(big_js_1.default(nextWeight).minus(weight));
        return {
            categoryName: next.name,
            diff,
        };
    }
}
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
        categories.set(position, new BMICategory({
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
    for (const cat of categories.values()) {
        if (cat.inRange(gender, bmi))
            return cat;
    }
    throw Error(`BMI category not found. gender: "${gender}", bmi: "${bmi}"`);
}
function getHealthyRange(gender, height) {
    const normal = categories.get(0);
    if (normal == null)
        throw Error('normal category not found');
    return normal.getRangeWeight(gender, height);
}
exports.getHealthyRange = getHealthyRange;
function getSuggestedWeightDiff(gender, height, weight) {
    const bmi = calcBMI(height, weight);
    const category = getBMICategory(gender, bmi);
    return category.getSuggest(gender, height, weight);
}
exports.getSuggestedWeightDiff = getSuggestedWeightDiff;
function roundUp(value) {
    return parseInt(big_js_1.default(value).round(0, 3).toFixed(), 10);
}
addCategories();
//# sourceMappingURL=BMI.js.map