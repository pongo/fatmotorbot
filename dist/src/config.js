"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = __importStar(require("envalid"));
function parseConfig() {
    return envalid_1.default.cleanEnv(process.env, {
        DATABASE_URL: envalid_1.str(),
        BOT_TOKEN: envalid_1.str(),
        BOT_WEBHOOK_DOMAIN: envalid_1.host({ default: undefined }),
        BOT_WEBHOOK_PATH: envalid_1.str({ default: undefined }),
        PORT: envalid_1.port({ default: undefined })
    });
}
exports.parseConfig = parseConfig;
//# sourceMappingURL=config.js.map