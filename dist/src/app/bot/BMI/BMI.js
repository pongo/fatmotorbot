"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const big_js_1 = __importDefault(require("big.js"));
const parseNumber_1 = require("src/shared/utils/parseNumber");
const StacklessError_1 = require("src/shared/utils/StacklessError");
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
    constructor({ name, position, lowerBMI, upperBMI, prev, next }) {
        this.name = name;
        this.position = position;
        this.prev = prev;
        this.next = next;
        this.lowerBMI = lowerBMI;
        this.upperBMI = upperBMI;
    }
    getRangeBMI(gender) {
        return [this.lowerBMI[gender], this.upperBMI[gender]];
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
    toHealthy(gender, height, weight) {
        const [healthyLower, healthyUpper] = getHealthyRange(gender, height);
        const healthyWeight = this.position < 0 ? healthyLower : healthyUpper;
        return roundUp(big_js_1.default(healthyWeight).minus(weight));
    }
    toNext(gender, height, weight) {
        if (this.position === -1 || this.position === 1)
            return null;
        const nextName = this.position < 0 ? this.next : this.prev;
        const next = categories.get(nextName);
        if (next == null)
            throw new StacklessError_1.StacklessError('next should be defined', { gender, height, weight, name: this.name });
        const [lower, upper] = next.getRangeWeight(gender, height);
        const nextWeight = this.position < 0 ? lower : upper;
        const diff = roundUp(big_js_1.default(nextWeight).minus(weight));
        return {
            categoryName: next.name,
            diff,
        };
    }
}
const VerySeverelyUnderweight = new BMICategory({
    name: 'Very severely underweight',
    position: -3,
    prev: undefined,
    next: 'Severely underweight',
    lowerBMI: { female: -Infinity, male: -Infinity },
    upperBMI: { female: 15, male: 15 },
});
categories.set(VerySeverelyUnderweight.name, VerySeverelyUnderweight);
const SeverelyUnderweight = new BMICategory({
    name: 'Severely underweight',
    position: -2,
    prev: 'Very severely underweight',
    next: 'Underweight',
    lowerBMI: { female: 15, male: 15 },
    upperBMI: { female: 16, male: 18 },
});
categories.set(SeverelyUnderweight.name, SeverelyUnderweight);
const Underweight = new BMICategory({
    name: 'Underweight',
    position: -1,
    prev: 'Severely underweight',
    next: 'Normal',
    lowerBMI: { female: 16, male: 18 },
    upperBMI: { female: 19, male: 20 },
});
categories.set(Underweight.name, Underweight);
const Normal = new BMICategory({
    name: 'Normal',
    position: 0,
    prev: 'Underweight',
    next: 'Overweight',
    lowerBMI: { female: 19, male: 20 },
    upperBMI: { female: 24, male: 25 },
});
categories.set(Normal.name, Normal);
const Overweight = new BMICategory({
    name: 'Overweight',
    position: 1,
    prev: 'Normal',
    next: 'Obese I',
    lowerBMI: { female: 24, male: 25 },
    upperBMI: { female: 30, male: 30 },
});
categories.set(Overweight.name, Overweight);
const Obese1 = new BMICategory({
    name: 'Obese I',
    position: 2,
    prev: 'Overweight',
    next: 'Obese I',
    lowerBMI: { female: 30, male: 30 },
    upperBMI: { female: 35, male: 35 },
});
categories.set(Obese1.name, Obese1);
const Obese2 = new BMICategory({
    name: 'Obese II',
    position: 3,
    prev: 'Obese I',
    next: 'Obese III',
    lowerBMI: { female: 35, male: 35 },
    upperBMI: { female: 40, male: 40 },
});
categories.set(Obese2.name, Obese2);
const Obese3 = new BMICategory({
    name: 'Obese III',
    position: 4,
    prev: 'Obese II',
    next: 'Obese IV',
    lowerBMI: { female: 40, male: 40 },
    upperBMI: { female: 45, male: 45 },
});
categories.set(Obese3.name, Obese3);
const Obese4 = new BMICategory({
    name: 'Obese IV',
    position: 5,
    prev: 'Obese III',
    next: 'Obese V',
    lowerBMI: { female: 45, male: 45 },
    upperBMI: { female: 50, male: 50 },
});
categories.set(Obese4.name, Obese4);
const Obese5 = new BMICategory({
    name: 'Obese V',
    position: 6,
    prev: 'Obese IV',
    next: 'Obese VI+',
    lowerBMI: { female: 50, male: 50 },
    upperBMI: { female: 60, male: 60 },
});
categories.set(Obese5.name, Obese5);
const Obese6 = new BMICategory({
    name: 'Obese VI+',
    position: 7,
    prev: 'Obese V',
    next: undefined,
    lowerBMI: { female: 60, male: 60 },
    upperBMI: { female: Infinity, male: Infinity },
});
categories.set(Obese6.name, Obese6);
function getBMICategoryName(gender, bmi) {
    return getBMICategory(gender, bmi).name;
}
exports.getBMICategoryName = getBMICategoryName;
function getBMICategory(gender, bmi) {
    for (const cat of categories.values()) {
        const part1 = bmi >= cat.lowerBMI[gender];
        const part2 = bmi < cat.upperBMI[gender];
        if (part1 && part2)
            return cat;
    }
    throw Error(`BMI category not found. gender: "${gender}", bmi: "${bmi}"`);
}
function getHealthyRange(gender, height) {
    const normal = categories.get('Normal');
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
//# sourceMappingURL=BMI.js.map