"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bmiPresenter = void 0;
function bmiPresenter(result) {
    if (result.isErr)
        return presentError();
    const data = result.value;
    if (data.case === 'need-user-weight')
        return 'Сперва нужно взвеситься';
    if (data.case === 'need-user-info')
        return 'Для расчета ИМТ не хватает данных. Укажи их при помощи /info';
    return presentBMI(data);
}
exports.bmiPresenter = bmiPresenter;
function presentError() {
    return 'ИМТ: <i>ошибка в бд</i>';
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
    const { bmi, healthyRange, categoryName, ideal, suggest } = data;
    return `ИМТ: ${bmi} — ${interpretCategory[categoryName]} ${healthy()}. А твой идеальный вес: ${presentIdeal()}.`;
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
    function presentIdeal() {
        return `${ideal.avg} кг (${ideal.min}–${ideal.max})`;
    }
}
//# sourceMappingURL=bmiPresenter.js.map