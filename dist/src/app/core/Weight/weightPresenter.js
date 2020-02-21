"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const bmiPresenter_1 = require("src/app/core/BMI/bmiPresenter");
const errors_1 = require("src/app/shared/errors");
const measureDifference_1 = require("src/app/shared/measureDifference");
function weightPresenter(result, now) {
    if (result.isErr)
        return presentError(result.error);
    const data = result.value;
    switch (data.case) {
        case "add:first":
            return presentAddFirst(data);
        case "add:diff":
            return presentAddDiff(data);
        case "current:empty":
            return presentCurrentEmpty();
        case "current:first":
            return presentCurrentFirst(data, now);
        case "current:diff":
            return presentCurrentDiff(data, now);
        default:
            return 'Ошибочный кейс';
    }
}
exports.weightPresenter = weightPresenter;
function presentError(error) {
    if (error instanceof errors_1.InvalidFormatError)
        return 'Какой-какой у тебя вес?';
    if (error instanceof errors_1.DatabaseError)
        return 'Что-то не так с базой данных. Вызывайте техподдержку!';
    return 'Ошибочная ошибка';
}
function presentAddFirst({ weight, bmi }) {
    const header = getHeader(weight);
    return `${header}Первый шаг сделан. Регулярно делай замеры, например, каждую пятницу утром.\n\n${bmiPresenter_1.bmiPresenter(bmi)}`;
}
function presentAddDiff({ diff, weight, bmi }) {
    const previous = presentDiff(diff);
    return `${getHeader(weight)}${previous}\n\n${bmiPresenter_1.bmiPresenter(bmi)}`;
}
function presentCurrentEmpty() {
    return `Впервые у меня? Встань на весы и взвесься. Затем добавь вес командой, например:\n\n/weight 88.41`;
}
function presentCurrentFirst({ current, bmi }, now) {
    const { date, value } = current;
    const note = getNoteByDaysAgo(date_fns_1.differenceInCalendarDays(now, date));
    return `${getHeader(value)}${note}\n\n${bmiPresenter_1.bmiPresenter(bmi)}`;
    function getNoteByDaysAgo(daysAgo) {
        if (daysAgo <= 5)
            return 'Регулярно делай замеры, например, каждую пятницу утром.';
        if (daysAgo <= 9)
            return 'Прошла неделя с последнего замера, пора взвешиваться!';
        if (daysAgo <= 7 * 7)
            return 'Несколько недель прошло, сколько ты теперь весишь?';
        if (daysAgo <= 150)
            return 'И было это пару месяцев назад, сколько же ты теперь весишь?';
        return 'Но было это чертовски давно, рискнешь встать на весы?';
    }
}
function presentCurrentDiff({ current, diff, bmi }, now) {
    const header = headerRelativeDate(current);
    const previous = presentDiff(diff);
    return `${header}${previous}\n\n${bmiPresenter_1.bmiPresenter(bmi)}`;
    function headerRelativeDate({ date, value }) {
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
        if (mark === 'future' || mark === 'current')
            return acc;
        const measure = diff[mark];
        if (measure == null)
            return acc;
        const weight = measure.value;
        const difference = differenceStr(measure.difference);
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
function getHeader(weight) {
    return `Твой вес: ${weight} кг.\n\n`;
}
//# sourceMappingURL=weightPresenter.js.map