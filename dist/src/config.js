"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConfig = void 0;
const envalid_1 = __importStar(require("envalid"));
function parseConfig() {
    return envalid_1.default.cleanEnv(process.env, {
        DATABASE_URL: envalid_1.str(),
        BOT_TOKEN: envalid_1.str(),
        BOT_WEBHOOK_DOMAIN: envalid_1.host({ default: undefined }),
        BOT_WEBHOOK_PATH: envalid_1.str({ default: undefined }),
        PORT: envalid_1.port({ default: undefined }),
        CHART_DOMAIN: envalid_1.host({ default: undefined }),
    });
}
exports.parseConfig = parseConfig;
//# sourceMappingURL=config.js.map