"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BMICategory_1 = require("src/app/core/useCases/BMI/utils/BMICategory");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const stats_lite_1 = require("stats-lite");
function broca(height, gender) {
    const coeff = gender === 'male' ? 0.9 : 0.85;
    const weight = (height - 100) * coeff;
    return parseNumber_1.roundToTwo(weight);
}
exports.broca = broca;
function brocaBrugsh(height) {
    const coeff = height < 165 ? 100 : height > 175 ? 110 : 105;
    const weight = height - coeff;
    return parseNumber_1.roundToTwo(weight);
}
exports.brocaBrugsh = brocaBrugsh;
function devine(height, gender) {
    const coeff = gender === 'male' ? 50 : 45.5;
    const weight = coeff + 2.3 * (0.393701 * height - 60);
    return parseNumber_1.roundToTwo(weight);
}
exports.devine = devine;
function robinson(height, gender) {
    const d = 0.393701 * height - 60;
    const weight = gender === 'male' ? 52 + 1.9 * d : 49 + 1.7 * d;
    return parseNumber_1.roundToTwo(weight);
}
exports.robinson = robinson;
function miller(height, gender) {
    const d = 0.393701 * height - 60;
    const weight = gender === 'male' ? 56.2 + 1.41 * d : 53.1 + 1.36 * d;
    return parseNumber_1.roundToTwo(weight);
}
exports.miller = miller;
function hamwi(height, gender) {
    const d = 0.393701 * height - 60;
    const weight = gender === 'male' ? 48 + 2.7 * d : 45.5 + 2.2 * d;
    return parseNumber_1.roundToTwo(weight);
}
exports.hamwi = hamwi;
function lemmens(height) {
    const weight = 22 * (height / 100) ** 2;
    return parseNumber_1.roundToTwo(weight);
}
exports.lemmens = lemmens;
function averageHealthyBMI(height, gender) {
    const range = BMICategory_1.getHealthyRange(gender, height);
    return parseNumber_1.roundToTwo(stats_lite_1.median(range));
}
exports.averageHealthyBMI = averageHealthyBMI;
function lorenz(height, gender) {
    const coeff = gender === 'male' ? 4 : 2;
    const weight = height - 100 - (height - 150) / coeff;
    return parseNumber_1.roundToTwo(weight);
}
exports.lorenz = lorenz;
function mohammed(height) {
    const weight = height * height * 0.00225;
    return parseNumber_1.roundToTwo(weight);
}
exports.mohammed = mohammed;
function insurance(height) {
    const AGE = 25;
    const weight = 50 + 0.75 * (height - 150) + (AGE - 20) / 4;
    return parseNumber_1.roundToTwo(weight);
}
exports.insurance = insurance;
function kuper(height, gender) {
    const weight = gender === 'male' ? 0.713 * height - 58 : 0.624 * height - 48.9;
    return parseNumber_1.roundToTwo(weight);
}
exports.kuper = kuper;
function breitman(height) {
    const weight = height * 0.7 - 50;
    return parseNumber_1.roundToTwo(weight);
}
exports.breitman = breitman;
function tetona(height, gender) {
    const coeff = gender === 'male' ? 20 : 10;
    const weight = height - (100 + (height - 100) / coeff);
    return parseNumber_1.roundToTwo(weight);
}
exports.tetona = tetona;
const formulas = [
    averageHealthyBMI,
    broca,
    brocaBrugsh,
    devine,
    hamwi,
    kuper,
    lemmens,
    lorenz,
    miller,
    mohammed,
    robinson,
    tetona,
];
function calcIdealWeight(height, gender) {
    const values = formulas.map(f => f(height, gender));
    const avg = parseNumber_1.roundToTwo(stats_lite_1.median(values), 0);
    const min = parseNumber_1.roundDown(Math.min(...values), 0);
    const max = parseNumber_1.roundUp(Math.max(...values), 0);
    return { avg, min, max };
}
exports.calcIdealWeight = calcIdealWeight;
//# sourceMappingURL=IdealWeight.js.map