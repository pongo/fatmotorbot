"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcIdealWeight = exports.tetona = exports.breitman = exports.kuper = exports.insurance = exports.mohammed = exports.lorenz = exports.averageHealthyBMI = exports.lemmens = exports.hamwi = exports.miller = exports.robinson = exports.devine = exports.brocaBrugsh = exports.broca = void 0;
/* tslint:disable:binary-expression-operand-order no-identical-functions */
const BMICategory_1 = require("src/app/core/services/BMI/utils/BMICategory");
const parseNumber_1 = require("src/shared/utils/parseNumber");
const stats_lite_1 = require("stats-lite");
/**
 * Источники:
 * * http://www.bmi-calculator.net/ideal-weight-calculator/
 * * https://beregifiguru.ru/%D0%9A%D0%B0%D0%BB%D1%8C%D0%BA%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%D1%8B/%D0%A0%D0%B0%D1%81%D1%87%D0%B5%D1%82-%D0%B8%D0%B4%D0%B5%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B3%D0%BE-%D0%B2%D0%B5%D1%81%D0%B0
 */
function broca(height, gender) {
    const coeff = gender === 'male' ? 0.9 : 0.85;
    const weight = (height - 100) * coeff;
    return parseNumber_1.roundToTwo(weight);
}
exports.broca = broca;
function brocaBrugsh(height) {
    // eslint-disable-next-line no-nested-ternary
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
function baseFormula(height, gender, koeffs) {
    const d = 0.393701 * height - 60;
    const weight = gender === 'male' ? koeffs.k1.m + koeffs.k2.m * d : koeffs.k1.f + koeffs.k2.f * d;
    return parseNumber_1.roundToTwo(weight);
}
function robinson(height, gender) {
    return baseFormula(height, gender, { k1: { m: 52, f: 49 }, k2: { m: 1.9, f: 1.7 } });
}
exports.robinson = robinson;
function miller(height, gender) {
    return baseFormula(height, gender, { k1: { m: 56.2, f: 53.1 }, k2: { m: 1.41, f: 1.36 } });
}
exports.miller = miller;
function hamwi(height, gender) {
    return baseFormula(height, gender, { k1: { m: 48, f: 45.5 }, k2: { m: 2.7, f: 2.2 } });
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
    const values = formulas.map((f) => f(height, gender));
    const avg = parseNumber_1.roundToTwo(stats_lite_1.median(values), 0);
    const min = parseNumber_1.roundDown(Math.min(...values), 0);
    const max = parseNumber_1.roundUp(Math.max(...values), 0);
    return { avg, min, max };
}
exports.calcIdealWeight = calcIdealWeight;
//# sourceMappingURL=IdealWeight.js.map