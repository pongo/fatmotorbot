"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlExists = void 0;
const url_exists_deep_1 = __importDefault(require("url-exists-deep"));
async function urlExists(url) {
    const exists = await url_exists_deep_1.default(url);
    if (exists === false)
        return undefined;
    return exists.href;
}
exports.urlExists = urlExists;
//# sourceMappingURL=urlExists.js.map