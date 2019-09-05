"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseNumber_1 = require("src/shared/utils/parseNumber");
function calcBMI(height, weight) {
    const bmi = (weight * 1.3) / calcBMICoeff(height);
    return parseNumber_1.roundToTwo(bmi);
}
exports.calcBMI = calcBMI;
function calcBMICoeff(height) {
    return (((height / 100) * height) / 100) * Math.sqrt(height / 100);
}
class BaseBMICategory {
}
class VerySeverelyUnderweight {
    constructor() {
        this.category = 'Very severely underweight';
    }
    check(bmi) {
        return bmi < 15;
    }
}
class SeverelyUnderweight {
    constructor() {
        this.category = 'Severely underweight';
    }
    check(bmi, gender) {
        return bmi < (gender === 'female' ? 16 : 18);
    }
}
class Underweight {
    constructor() {
        this.category = 'Underweight';
    }
    check(bmi, gender) {
        return bmi < (gender === 'female' ? 19 : 20);
    }
}
class Normal {
    constructor() {
        this.category = 'Normal';
    }
    check(bmi, gender) {
        return bmi < (gender === 'female' ? 24 : 25);
    }
    static getRange(gender) {
        const [lower, upper] = gender === 'female' ? [19, 24] : [20, 25];
        return [lower, upper];
    }
}
class Overweight {
    constructor() {
        this.category = 'Overweight';
    }
    check(bmi) {
        return bmi < 30;
    }
}
class Obese1 {
    constructor() {
        this.category = 'Obese I';
    }
    check(bmi) {
        return bmi < 35;
    }
}
class Obese2 {
    constructor() {
        this.category = 'Obese II';
    }
    check(bmi) {
        return bmi < 40;
    }
}
class Obese3 {
    constructor() {
        this.category = 'Obese III';
    }
    check(bmi) {
        return bmi < 45;
    }
}
class Obese4 {
    constructor() {
        this.category = 'Obese IV';
    }
    check(bmi) {
        return bmi < 50;
    }
}
class Obese5 {
    constructor() {
        this.category = 'Obese V';
    }
    check(bmi) {
        return bmi < 60;
    }
}
class Obese6 {
    constructor() {
        this.category = 'Obese VI+';
    }
    check(bmi) {
        return bmi >= 60;
    }
}
const categories = [
    new VerySeverelyUnderweight(),
    new SeverelyUnderweight(),
    new Underweight(),
    new Normal(),
    new Overweight(),
    new Obese1(),
    new Obese2(),
    new Obese3(),
    new Obese4(),
    new Obese5(),
    new Obese6(),
];
function getBMICategory(gender, bmi) {
    for (const cat of categories) {
        if (cat.check(bmi, gender))
            return cat.category;
    }
    throw Error(`BMI category not found. gender: "${gender}", bmi: "${bmi}"`);
}
exports.getBMICategory = getBMICategory;
function getHealthyRange(gender, height) {
    const [lowerBMI, upperBMI] = Normal.getRange(gender);
    const coeff = calcBMICoeff(height);
    const targetLower = (lowerBMI / 1.3) * coeff;
    const targetUpper = (upperBMI / 1.3) * coeff;
    return [parseNumber_1.roundToTwo(targetLower), parseNumber_1.roundToTwo(targetUpper)];
}
exports.getHealthyRange = getHealthyRange;
//# sourceMappingURL=BMI.js.map