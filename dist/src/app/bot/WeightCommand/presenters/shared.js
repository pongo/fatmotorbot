"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chartImage = exports.presentDiff = exports.getHeader = void 0;
function getHeader(weight) {
    return `Твой вес: ${weight} кг.\n\n`;
}
exports.getHeader = getHeader;
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
exports.presentDiff = presentDiff;
function chartImage(chartUrl) {
    if (chartUrl == null)
        return '';
    return `<a href="${chartUrl}">&#8205;</a>`;
}
exports.chartImage = chartImage;
//# sourceMappingURL=shared.js.map