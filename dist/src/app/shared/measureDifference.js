"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const parseNumber_1 = require("src/shared/utils/parseNumber");
function measureDifference(current, previous, relativeDate) {
    const sorted = [...previous].reverse();
    const result = {};
    for (const { date, value } of sorted) {
        const mark = getDateMark(current.date, date, relativeDate);
        if (mark === 'current' || mark === 'future')
            continue;
        if (mark in result)
            continue;
        result[mark] = { date, value, difference: parseNumber_1.minus(current.value, value) };
    }
    return result;
}
exports.measureDifference = measureDifference;
function getDateMark(current, other, relativeDate = current) {
    if (date_fns_1.isSameSecond(current, other))
        return 'current';
    const daysAgo = date_fns_1.differenceInCalendarDays(relativeDate, other);
    if (daysAgo < 0)
        return 'future';
    if (daysAgo === 0)
        return 'today';
    if (daysAgo === 1)
        return 'yesterday';
    if (daysAgo <= 4)
        return 'daysAgo';
    if (daysAgo <= 7 + 3)
        return 'weekAgo';
    if (daysAgo <= 14 + 4)
        return 'twoWeeksAgo';
    if (daysAgo <= 14 + 31)
        return 'monthAgo';
    if (daysAgo <= 4 * 31)
        return 'monthsAgo';
    if (daysAgo <= 9 * 31)
        return 'halfYearAgo';
    if (daysAgo <= 15 * 31)
        return 'yearAgo';
    return 'yearsAgo';
}
exports.getDateMark = getDateMark;
//# sourceMappingURL=measureDifference.js.map