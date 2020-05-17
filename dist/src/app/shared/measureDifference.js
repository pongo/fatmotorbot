"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateMark = exports.measureDifference = void 0;
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
    const dateMarks = [
        [-1, 'future'],
        [0, 'today'],
        [1, 'yesterday'],
        [4, 'daysAgo'],
        [7 + 3, 'weekAgo'],
        [14 + 4, 'twoWeeksAgo'],
        [14 + 31, 'monthAgo'],
        [4 * 31, 'monthsAgo'],
        [9 * 31, 'halfYearAgo'],
        [15 * 31, 'yearAgo'],
    ];
    for (const [ago, dateMark] of dateMarks) {
        if (daysAgo <= ago)
            return dateMark;
    }
    return 'yearsAgo';
}
exports.getDateMark = getDateMark;
//# sourceMappingURL=measureDifference.js.map