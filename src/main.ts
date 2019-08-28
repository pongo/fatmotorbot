import { parseConfig } from './config';
import { createDB } from 'src/shared/infrastructure/createDB';

async function main() {
  const config = parseConfig();
  const db = createDB(config.DATABASE_URL);
}

main(); // tslint:disable-line:no-floating-promises
