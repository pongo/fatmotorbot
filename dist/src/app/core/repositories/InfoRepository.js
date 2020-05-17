"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoRepository = void 0;
const slonik_1 = require("slonik");
const errors_1 = require("src/app/shared/errors");
const result_1 = require("src/shared/utils/result");
class InfoRepository {
    constructor(db) {
        this.db = db;
    }
    async set(userId, data) {
        try {
            await this.db.any(slonik_1.sql `
        INSERT INTO users (user_id, gender, height)
        VALUES (${userId}, ${data.gender}, ${data.height})
        ON CONFLICT (user_id) DO UPDATE
          SET gender = excluded.gender,
              height = excluded.height;
      `);
            return result_1.Result.ok();
        }
        catch (e) {
            console.error('InfoRepository.set()', e);
            return result_1.Result.err(new errors_1.DatabaseError(e));
        }
    }
    async get(userId) {
        try {
            const result = await this.db.maybeOne(slonik_1.sql `
        SELECT gender, height
        FROM users
        WHERE user_id = ${userId};
      `);
            if (result == null)
                return result_1.Result.ok(null);
            return result_1.Result.ok(result);
        }
        catch (e) {
            console.error('InfoRepository.get()', e);
            return result_1.Result.err(new errors_1.DatabaseError(e));
        }
    }
}
exports.InfoRepository = InfoRepository;
//# sourceMappingURL=InfoRepository.js.map