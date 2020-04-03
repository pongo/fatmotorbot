"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function prepareDataForChart(userId, measures, bmi) {
    const data = prepareData(measures);
    const user = prepareUser();
    return { userId, data, user };
    function prepareData(values) {
        return [...values].reverse();
    }
    function prepareUser() {
        if (bmi == null)
            return undefined;
        return {
            health: {
                min: bmi.healthyRange[0],
                max: bmi.healthyRange[1],
            },
            ideal: {
                min: bmi.ideal.min,
                max: bmi.ideal.max,
            },
            next: getNext(bmi.suggest),
        };
        function getNext(suggest) {
            var _a;
            if (suggest.alreadyHealthy)
                return undefined;
            return (_a = suggest.toNext) === null || _a === void 0 ? void 0 : _a.nextWeight;
        }
    }
}
exports.prepareDataForChart = prepareDataForChart;
function yyymmdd(d) {
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}
exports.yyymmdd = yyymmdd;
function createChartQuery({ userId, user, data }) {
    return `/${userId}.png?d=${getData()}${getUser()}`;
    function getData() {
        return e(data.map(({ date, value }) => `${yyymmdd(date)}_${value}`).join('!'));
    }
    function getUser() {
        if (user == null)
            return '';
        const h = `&h=${user.health.min}!${user.health.max}`;
        const i = `&i=${user.ideal.min}!${user.ideal.max}`;
        const n = user.next == null ? '' : `&n=${user.next}`;
        return `${h}${i}${n}`;
    }
    function e(text) {
        return encodeURIComponent(text);
    }
}
exports.createChartQuery = createChartQuery;
//# sourceMappingURL=prepareDataForChart.js.map