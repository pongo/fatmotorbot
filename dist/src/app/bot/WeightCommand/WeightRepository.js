"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slonik_1 = require("slonik");
const result_1 = require("../../../shared/utils/result");
const utils_1 = require("../../../shared/utils/utils");
class WeightRepository {
    constructor(db) {
        this.db = db;
    }
    async add(userId, weight, date) {
        const valueType = 'weight';
        try {
            await this.db.any(slonik_1.sql `
        INSERT INTO measures (user_id, value_type, value, date)
        VALUES (${userId}, ${valueType}, ${weight}, to_timestamp(${utils_1.toTimestamp(date)}));
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
        WHERE value_type = 'weight'
          AND user_id = ${userId}
        ORDER BY date DESC;
      `);
            const measures = result;
            return result_1.Result.ok(measures);
        }
        catch (e) {
            console.error('WeightRepository.getAll()', e);
            return result_1.Result.err(e);
        }
    }
}
exports.WeightRepository = WeightRepository;
//# sourceMappingURL=WeightRepository.js.map