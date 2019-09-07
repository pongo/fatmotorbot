import { StacklessError } from './StacklessError';

export type Ok<T> = {
  readonly isOk: true;
  readonly isErr: false;
  readonly value: T;
};

export type Err<E extends Error = Error> = {
  readonly isOk: false;
  readonly isErr: true;
  readonly error: E;
};

export type Result<T = undefined, E extends Error = Error> = Ok<T> | Err<E>;

export const Result = {
  ok,
  err,
  combine,
};

function ok<T = undefined>(value?: T): Result<T, never> {
  return {
    isOk: true,
    isErr: false,
    value: value as T,
  } as const;
}

function err<E extends Error = Error>(error: E): Result<never, E>;
function err<E extends Error = Error>(error: string, data?: unknown): Result<never, E>;
function err<E extends Error = Error>(error: E | string, data?: unknown): Result<never, E> {
  return {
    isOk: false,
    isErr: true,
    error: typeof error === 'string' ? (new StacklessError(error, data) as E) : error,
  } as const;
}

type ResultsOfT<T extends unknown[]> = { [P in keyof T]: Result<T[P]> };
type OksOfT<T extends unknown[]> = { [P in keyof T]: Ok<T[P]> };

function combine<T extends unknown[]>(results: ResultsOfT<T>): Result<T> {
  for (const result of results) {
    if (result.isErr) return result;
  }
  return Result.ok((results as OksOfT<T>).map(result => result.value) as T);
}
