"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = __importDefault(require("querystring"));
const assert_1 = require("src/shared/utils/assert");
const url_1 = __importDefault(require("url"));
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
function parseChartQuery(url) {
    const { pathname, query } = url_1.default.parse(url);
    const parsed = querystring_1.default.parse(query !== null && query !== void 0 ? query : '');
    const userId = parseUserId(pathname !== null && pathname !== void 0 ? pathname : '');
    const data = parseData(get('d'));
    const user = parseUser();
    return { userId, data, user };
    function parseUserId(pathname_) {
        const reUserId = /^\/(\d+)\.png$/i;
        if (!reUserId.test(pathname_))
            throw new Error(`Invalid pathname: "${pathname_}"`);
        return parseInt(pathname_.replace(reUserId, '$1'), 10);
    }
    function parseData(str) {
        if (str === '')
            return [];
        return str.split('!').map(part => {
            const [date, value] = part.split('_');
            return { date: new Date(date), value: parseKg(value) };
        });
    }
    function parseUser() {
        const h = get('h', true);
        const i = get('i', true);
        const n = get('n', true);
        if (h == null && i == null)
            return undefined;
        assert_1.assert(h != null, '"h" should be defined');
        assert_1.assert(i != null, '"i" should be defined');
        const health = parseMinMax(h);
        const ideal = parseMinMax(i);
        const next = n == null ? undefined : parseKg(n);
        return { health, ideal, next };
        function parseMinMax(str) {
            const [min, max] = str.split('!');
            return { min: parseKg(min), max: parseKg(max) };
        }
    }
    function parseKg(value) {
        const weight = parseFloat(value);
        if (Number.isNaN(weight))
            throw Error(`weight (${value}) is NaN`);
        return weight;
    }
    function get(key, optional = false) {
        const value = parsed[key];
        if (optional && value == null)
            return undefined;
        assert_1.assert(value != null, `"${key}" should be defined`);
        assert_1.assert(!Array.isArray(value), `"${key}" should not be an array`);
        return value;
    }
}
exports.parseChartQuery = parseChartQuery;
//# sourceMappingURL=prepareDataForChart.js.map