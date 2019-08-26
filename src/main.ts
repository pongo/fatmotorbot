import { createPool } from 'slonik';
import { parseConfig } from './config';

async function main() {
  const config = parseConfig();
  const db = createPool(config.DATABASE_URL);
}

main(); // tslint:disable-line:no-floating-promises
