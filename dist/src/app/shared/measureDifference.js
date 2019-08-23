"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
function measureDifference(current, previous) {
    const sorted = sortMeasuresFromOldestToNewest(previous);
    let result = {};
    for (const { date, value } of sorted) {
        const mark = getDateMark(current.date, date);
        if (mark === 'future')
            continue;
        if (mark in result)
            continue;
        result = addMeasure(result, mark, current.value, date, value);
    }
    return result;
}
exports.measureDifference = measureDifference;
function addMeasure(result, mark, currentValue, date, value) {
    return { ...result, [mark]: { date, value, difference: currentValue - value } };
}
function getDateMark(current, other) {
    const daysAgo = date_fns_1.differenceInCalendarDays(current, other);
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
function sortMeasuresFromOldestToNewest(array) {
    return [...array].sort((a, b) => +a.date - +b.date);
}
exports.sortMeasuresFromOldestToNewest = sortMeasuresFromOldestToNewest;
//# sourceMappingURL=measureDifference.js.map