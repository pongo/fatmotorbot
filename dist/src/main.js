"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const createDB_1 = require("src/shared/infrastructure/createDB");
async function main() {
    const config = config_1.parseConfig();
    const db = createDB_1.createDB(config.DATABASE_URL);
}
main();
//# sourceMappingURL=main.js.map