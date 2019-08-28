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

export function toTimestamp(date: Date): number {
  return Math.round(date.getTime() / 1000); // https://github.com/gajus/slonik/issues/70
}
