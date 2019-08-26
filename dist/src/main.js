"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const slonik_1 = require("slonik");
const config_1 = require("./config");
async function main() {
    const config = config_1.parseConfig();
    const db = slonik_1.createPool(config.DATABASE_URL);
}
main();
//# sourceMappingURL=main.js.map