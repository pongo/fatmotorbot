"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateMark = exports.measureDifference = void 0;
const date_fns_1 = require("date-fns");
const parseNumber_1 = require("src/shared/utils/parseNumber");
/**
 * Возвращает сравнение текущего замера с предыдущими.
 *
 * @param current Текущий замер
 * @param previous Все замеры в порядке от новых к старым
 * @param relativeDate Сегодняшняя дата
 */
function measureDifference(current, previous, relativeDate) {
    const sorted = [...previous].reverse();
    const result = {};
    for (const { date, value } of sorted) {
        const mark = getDateMark(current.date, date, relativeDate);
        if (mark === 'current' || mark === 'future')
            continue;
        if (mark in result)
            continue; // если уже записан, то пропуск: записываем только самый старый замер
        result[mark] = { date, value, difference: parseNumber_1.minus(current.value, value) };
    }
    return result;
}
exports.measureDifference = measureDifference;
/**
 * Маркирует указанную дату (эта дата была неделю назад, эта — месяц и т.п.).
 *
 * @param current дата текущего замера
 * @param other дата другого замера
 * @param relativeDate с этой датой идет сравнение
 */
function getDateMark(current, other, relativeDate = current) {
    if (date_fns_1.isSameSecond(current, other))
        return 'current';
    // получаем количество дней между датами.
    // т.к. замеры идут последовательно, то чем больше дней, тем старее дата.
    // и нам нужен только самый старый замер (т.е. наибольшее количество дней).
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