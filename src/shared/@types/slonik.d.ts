import { TypeParserType } from 'slonik';

declare module 'slonik' {
  export function createIntervalTypeParser(): TypeParserType<number>;
  export function createNumericTypeParser(): TypeParserType<number>;
}
