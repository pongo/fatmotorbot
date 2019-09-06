"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slonik_1 = require("slonik");
function bmiPresenter(result) {
    if (result.isErr)
        return presentError(result.error);
    return presentBMI(result.value);
}
exports.bmiPresenter = bmiPresenter;
function presentError(error) {
    if (error instanceof slonik_1.SlonikError)
        return 'ИМТ: <i>ошибка в бд</i>';
    return 'ИМТ: Ошибочная ошибка';
}
const interpretCategory = {
    'Very severely underweight': 'у тебя выраженный дефицит веса, скорее ко врачу!',
    'Severely underweight': 'у тебя дефицит веса.',
    Underweight: 'у тебя неопасный дефицит веса.',
    Normal: 'у тебя здоровый вес 💪.',
    Overweight: 'у тебя избыточный вес.',
    'Obese I': 'у тебя ожирение I степени.',
    'Obese II': 'у тебя ожирение II степени.',
    'Obese III': 'у тебя ожирение III степени.',
    'Obese IV': 'у тебя ожирение IV степени.',
    'Obese V': 'у тебя ожирение V степени.',
    'Obese VI+': 'у тебя ожирение VI степени или больше.',
};
const interpretNextCategory = {
    'Very severely underweight': '❌',
    'Severely underweight': '«обычный» дефицит веса',
    Underweight: 'неопасный дефицит',
    Normal: '❌',
    Overweight: '«всего лишь» избыточный вес',
    'Obese I': 'I степень',
    'Obese II': 'II степень',
    'Obese III': 'II степень',
    'Obese IV': 'IV степень',
    'Obese V': 'V степень',
    'Obese VI+': '❌',
};
function presentBMI(data) {
    if (data.case === 'need-user-info')
        return 'Для расчета ИМТ не хватает данных. Укажи их при помощи /info';
    const { bmi, healthyRange, categoryName, ideal, suggest } = data;
    return `ИМТ: ${bmi} — ${interpretCategory[categoryName]} ${healthy()}. А твой идеальный вес: ${ideal} кг.`;
    function healthy() {
        const [hLower, hUpper] = healthyRange;
        const range = `от ${hLower} до ${hUpper} кг`;
        if (suggest.alreadyHealthy)
            return `Твоя граница здорового веса: ${range}`;
        const { toHealthy, toNext } = suggest;
        return `Тебе нужно ${diffKg(toHealthy)} до здорового веса, который для тебя ${range}${next(toNext)}`;
    }
    function next(toNext) {
        if (toNext == null)
            return '';
        const nextCategory = interpretNextCategory[toNext.categoryName];
        return `. Первым шагом тебе нужно ${diffKg(toNext.diff)} — тогда у тебя будет ${nextCategory}`;
    }
    function diffKg(to) {
        const action = to >= 0 ? 'набрать' : 'сбросить';
        return `${action} ${Math.abs(to)} кг`;
    }
}
//# sourceMappingURL=bmiPresenter.js.map