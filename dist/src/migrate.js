"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_connection_string_1 = require("pg-connection-string");
const postgres_migrations_1 = require("postgres-migrations");
const config_1 = require("./config");
async function main() {
    const config = config_1.parseConfig();
    const dbConfig = pg_connection_string_1.parse(config.DATABASE_URL);
    await postgres_migrations_1.migrate({
        database: dbConfig.database,
        user: dbConfig.user,
        password: dbConfig.password,
        host: dbConfig.host,
        port: parseInt(dbConfig.port, 10),
    }, 'migrations', { logger: console.log });
}
main().catch(console.error);
//# sourceMappingURL=migrate.js.map