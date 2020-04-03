"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
const querystring_1 = __importDefault(require("querystring"));
const assert_1 = require("src/shared/utils/assert");
function parseChartQuery(url) {
    const { pathname, query } = url_1.default.parse(url);
    const parsed = querystring_1.default.parse(query !== null && query !== void 0 ? query : '');
    const userId = parseUserId(pathname !== null && pathname !== void 0 ? pathname : '');
    const data = parseData(get('d'));
    const user = parseUser(get('h', true), get('i', true), get('n', true));
    return { userId, data, user };
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
function parseData(str) {
    if (str === '')
        throw Error('"d" should not be empty');
    return str.split('!').map(part => {
        const [date, value] = part.split('_');
        return { date: new Date(date), value: parseKg(value) };
    });
}
function parseKg(value) {
    const weight = parseFloat(value);
    if (Number.isNaN(weight))
        throw Error(`weight (${value}) is NaN`);
    return weight;
}
function parseUserId(pathname) {
    const reUserId = /^\/(\d+)\.png$/i;
    if (!reUserId.test(pathname))
        throw new Error(`Invalid pathname: "${pathname}"`);
    return parseInt(pathname.replace(reUserId, '$1'), 10);
}
function parseUser(h, i, n) {
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
//# sourceMappingURL=parseChartQuery.js.map