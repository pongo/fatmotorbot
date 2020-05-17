"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightRepository = void 0;
const slonik_1 = require("slonik");
const errors_1 = require("src/app/shared/errors");
const result_1 = require("src/shared/utils/result");
const utils_1 = require("src/shared/utils/utils");
const weightValueType = 'weight';
class WeightRepository {
    constructor(db) {
        this.db = db;
    }
    async add(userId, weight, date) {
        try {
            await this.db.any(slonik_1.sql `
        INSERT INTO measures (user_id, value_type, value, date)
        VALUES (${userId}, ${weightValueType}, ${weight}, to_timestamp(${utils_1.toTimestamp(date)}));
      `);
            return result_1.Result.ok();
        }
        catch (e) {
            console.error('WeightRepository.add()', e);
            return result_1.Result.err(e);
        }
    }
    async getAll(userId) {
        try {
            const result = await this.db.any(slonik_1.sql `
        SELECT date, value
        FROM measures
        WHERE value_type = ${weightValueType}
          AND user_id = ${userId}
        ORDER BY date DESC;
      `);
            const measures = result;
            return result_1.Result.ok(measures);
        }
        catch (e) {
            console.error('WeightRepository.getAll()', e);
            return result_1.Result.err(new errors_1.DatabaseError(e));
        }
    }
    async getCurrent(userId) {
        try {
            const result = await this.db.maybeOne(slonik_1.sql `
        SELECT value
        FROM measures
        WHERE value_type = ${weightValueType}
          AND user_id = ${userId}
        ORDER BY date DESC
        LIMIT 1;
      `);
            const current = result == null ? result : result.value;
            return result_1.Result.ok(current);
        }
        catch (e) {
            console.error('WeightRepository.getCurrent()', e);
            return result_1.Result.err(new errors_1.DatabaseError(e));
        }
    }
}
exports.WeightRepository = WeightRepository;
//# sourceMappingURL=WeightRepository.js.map