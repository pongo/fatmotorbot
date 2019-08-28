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

type UnixTime = number;

export function toTimestamp(date: Date): UnixTime {
  return Math.round(date.getTime() / 1000); // https://github.com/gajus/slonik/issues/70
}
