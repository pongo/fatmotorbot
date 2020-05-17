"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDB = void 0;
const slonik_1 = require("slonik");
function createDB(databaseUrl) {
    return slonik_1.createPool(databaseUrl, {
        typeParsers: [slonik_1.createBigintTypeParser(), slonik_1.createIntervalTypeParser(), slonik_1.createNumericTypeParser()],
    });
}
exports.createDB = createDB;
//# sourceMappingURL=createDB.js.map