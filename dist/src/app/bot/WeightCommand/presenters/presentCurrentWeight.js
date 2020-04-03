"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const bmiPresenter_1 = require("src/app/bot/presenters/bmiPresenter");
const shared_1 = require("src/app/bot/presenters/shared");
const shared_2 = require("src/app/bot/WeightCommand/presenters/shared");
const measureDifference_1 = require("src/app/shared/measureDifference");
function presentCurrentWeight(result, now, chartUrl) {
    if (result.isErr)
        return shared_1.presentDatabaseError();
    const data = result.value;
    switch (data.case) {
        case "current:empty":
            return presentCurrentEmpty();
        case "current:first":
            return presentCurrentFirst(data, now);
        default:
            return presentCurrentDiff(data, now, chartUrl);
    }
}
exports.presentCurrentWeight = presentCurrentWeight;
function presentCurrentEmpty() {
    return `Впервые у меня? Встань на весы и взвесься. Затем добавь вес командой, например:\n\n/weight 88.41`;
}
function presentCurrentFirst({ current, bmi }, now) {
    const { date, value } = current;
    const note = getNoteByDaysAgo(date_fns_1.differenceInCalendarDays(now, date));
    return `${shared_2.getHeader(value)}${note}\n\n${bmiPresenter_1.bmiPresenter(bmi)}`;
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
function presentCurrentDiff({ current, diff, bmi }, now, chartUrl) {
    const header = headerRelativeDate(current);
    const previous = shared_2.presentDiff(diff);
    return `${header}${previous}\n\n${bmiPresenter_1.bmiPresenter(bmi)}${shared_2.chartImage(chartUrl)}`;
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
//# sourceMappingURL=presentCurrentWeight.js.map