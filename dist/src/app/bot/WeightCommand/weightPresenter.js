"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const errors_1 = require("../../shared/errors");
const measureDifference_1 = require("../../shared/measureDifference");
function weightPresenter(result, now) {
    if (result.isErr)
        return presentError(result.error);
    const data = result.value;
    return data.kind === 'current' ? presentCurrent(data, now) : presentAdd(data);
}
exports.weightPresenter = weightPresenter;
function presentAdd({ weight, diff }) {
    const header = `Твой вес: ${weight} кг.\n\n`;
    if (diff == null) {
        return `${header}Первый шаг сделан. Регулярно делай замеры, например, каждую пятницу утром.`;
    }
    const previous = presentDiff(diff);
    return `${header}${previous}`;
}
function presentError(error) {
    if (error instanceof errors_1.InvalidFormatError)
        return 'Какой-какой у тебя вес?';
    return 'Что-то не так с базой данных. Вызывайте техподдержку!';
}
function presentCurrent({ current, diff }, now) {
    if (current == null) {
        return `Впервые у меня? Встань на весы и взвесься. Затем добавь вес командой, например:\n\n/weight 88.41`;
    }
    if (diff == null)
        return firstMeasure(current, now);
    return presentCurrentDiff(current, diff, now);
}
function presentCurrentDiff(current, diff, now) {
    const header = headerRelativeDate(current, now);
    const previous = presentDiff(diff);
    return `${header}${previous}`;
}
function headerRelativeDate({ date, value }, now) {
    const markToHeader = {
        current: 'Твой вес',
        today: 'Твой вес',
        yesterday: 'Вес вчера',
        daysAgo: 'Вес пару дней назад',
        weekAgo: 'Вес неделю назад',
        twoWeeksAgo: 'Вес две недели назад',
        monthAgo: 'Вес месяц назад',
        monthsAgo: 'Вес пару месяцев назад',
        halfYearAgo: 'Вес полгода назад',
        yearAgo: 'Вес год назад',
        yearsAgo: 'Вес годы назад',
        future: 'Ты будешь весить',
    };
    const mark = measureDifference_1.getDateMark(now, date);
    return `${markToHeader[mark]}: ${value} кг.\n\n`;
}
function presentDiff(diff) {
    let firstAgoLabelAdded = false;
    const dates = [
        ['today', 'Сегодня ранее'],
        ['yesterday', 'Вчера'],
        ['daysAgo', 'Пару дней :ago:'],
        ['weekAgo', 'Неделю :ago:'],
        ['twoWeeksAgo', 'Две недели :ago:'],
        ['monthAgo', 'Месяц :ago:'],
        ['monthsAgo', 'Пару месяцев :ago:'],
        ['halfYearAgo', 'Полгода :ago:'],
        ['yearAgo', 'Год :ago:'],
        ['yearsAgo', 'Годы назад'],
    ];
    return dates.reduce(reducer, '').trim();
    function reducer(acc, [mark, text]) {
        if (mark === 'future' || mark === 'current' || diff[mark] == null)
            return acc;
        const weight = diff[mark].value;
        const difference = differenceStr(diff[mark].difference);
        return `${acc}\n• ${ago(text)}: ${weight} ${difference}`.trim();
    }
    function ago(text) {
        if (text.includes(':ago:') && !firstAgoLabelAdded) {
            firstAgoLabelAdded = true;
            return text.replace(':ago:', 'назад');
        }
        return text.replace(':ago:', '').trim();
    }
    function differenceStr(difference) {
        if (difference === 0)
            return '';
        const fixed = difference.toFixed(2).replace('.00', '');
        const withSign = difference > 0 ? `+${fixed}` : fixed.replace('-', '−');
        return `(${withSign})`;
    }
}
function firstMeasure({ date, value }, now) {
    const header = `Твой вес: ${value} кг.\n\n`;
    const daysAgo = date_fns_1.differenceInCalendarDays(now, date);
    if (daysAgo <= 5)
        return `${header}Регулярно делай замеры, например, каждую пятницу утром.`;
    if (daysAgo <= 9)
        return `${header}Прошла неделя с последнего замера, пора взвешиваться!`;
    if (daysAgo <= 7 * 7)
        return `${header}Несколько недель прошло, сколько ты теперь весишь?`;
    if (daysAgo <= 150)
        return `${header}И было это пару месяцев назад, сколько же ты теперь весишь?`;
    return `${header}Но было это чертовски давно, рискнешь встать на весы?`;
}
//# sourceMappingURL=weightPresenter.js.map