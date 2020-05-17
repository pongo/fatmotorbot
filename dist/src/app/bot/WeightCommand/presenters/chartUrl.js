"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddChartUrl = exports.getCurrentChartUrl = exports.getChartUrl = exports.createChartUrl = void 0;
const prepareDataForChart_1 = require("src/app/core/useCases/Weight/prepareDataForChart");
const urlExists_1 = require("src/shared/utils/urlExists");
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
async function getCurrentChartUrl(result, chartDomain) {
    if (result.isErr)
        return undefined;
    if (result.value.case !== "current:diff")
        return undefined;
    return getChartUrl(result.value.chart, chartDomain);
}
exports.getCurrentChartUrl = getCurrentChartUrl;
async function getAddChartUrl(result, chartDomain) {
    if (result.isErr)
        return undefined;
    if (result.value.case !== "add:diff")
        return undefined;
    return getChartUrl(result.value.chart, chartDomain);
}
exports.getAddChartUrl = getAddChartUrl;
//# sourceMappingURL=chartUrl.js.map