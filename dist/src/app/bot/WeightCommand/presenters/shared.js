"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prepareDataForChart_1 = require("src/app/core/useCases/Weight/prepareDataForChart");
const urlExists_1 = require("src/shared/utils/urlExists");
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
function createChartUrl(chart, chartDomain) {
    if (chart == null)
        return undefined;
    if (chartDomain == null || chartDomain === '')
        return undefined;
    const chartQuery = prepareDataForChart_1.createChartQuery(chart);
    return `https://${chartDomain}${chartQuery}`;
}
exports.createChartUrl = createChartUrl;
async function getChartUrl(chart, chartDomain) {
    const url = createChartUrl(chart, chartDomain);
    return url == null ? undefined : urlExists_1.urlExists(url);
}
exports.getChartUrl = getChartUrl;
//# sourceMappingURL=shared.js.map