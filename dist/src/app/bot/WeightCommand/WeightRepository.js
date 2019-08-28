"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_queue_1 = __importDefault(require("p-queue"));
const slonik_1 = require("slonik");
const createDB_1 = require("src/shared/infrastructure/createDB");
const result_1 = require("src/shared/utils/result");
class WeightRepository {
    constructor(db, writeQueue = new p_queue_1.default({ concurrency: 1 })) {
        this.db = db;
        this.writeQueue = writeQueue;
    }
    async add(userId, weight, date) {
        try {
            await this.writeQueue.add(async () => {
                return this.db.any(slonik_1.sql `
          INSERT INTO measures (user_id, value_type, value, date)
          VALUES (${userId}, 'weight', ${weight}, to_timestamp(${createDB_1.toTimestamp(date)}));
        `);
            });
            return result_1.Result.ok();
        }
        catch (error) {
            return result_1.Result.err(error);
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
        catch (error) {
            return result_1.Result.err(error);
        }
    }
}
exports.WeightRepository = WeightRepository;
//# sourceMappingURL=WeightRepository.js.map