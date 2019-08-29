import {
  createBigintTypeParser,
  createIntervalTypeParser,
  createNumericTypeParser,
  createPool,
  DatabasePoolType,
} from 'slonik';

export function createDB(databaseUrl: string): DatabasePoolType {
  return createPool(databaseUrl, {
    typeParsers: [createBigintTypeParser(), createIntervalTypeParser(), createNumericTypeParser()],
  });
}
