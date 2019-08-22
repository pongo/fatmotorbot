/* tslint:disable:member-ordering object-literal-sort-keys */
// istanbul ignore file

// Раньше здесь был https://github.com/badrap/result
// Но я заменил на свой упрощенный вариант

import { StacklessError } from './StacklessError';

type Ok<T> = {
  readonly isOk: true;
  readonly isErr: false;
  readonly value: T;
};

type Err<E extends Error> = {
  readonly isOk: false;
  readonly isErr: true;
  readonly error: E;
};

export type Result<T, E extends Error = Error> = Ok<T> | Err<E>;

export const Result = {
  ok,
  err,
  combine,
} as const;

function ok<T>(value: T): Result<T, never> {
  return {
    isOk: true,
    isErr: false,
    value,
  } as const;
}

function err<E extends Error = Error>(error: E): Result<never, E>;
function err<E extends Error = Error>(error: string, data?: unknown): Result<never, E>;
function err<E extends Error = Error>(error: E | string, data?: unknown): Result<never, E> {
  const _error = typeof error === 'string' ? (new StacklessError(error, data) as E) : error;
  return {
    isOk: false,
    isErr: true,
    error: _error,
  } as const;
}

function combine<T, E extends Error = Error>(results: Result<T, E>[]): Err<E> | Ok<T[]> {
  for (const result of results) {
    if (result.isErr) return result;
  }
  return Result.ok((results as Ok<T>[]).map(result => result.value));
}
