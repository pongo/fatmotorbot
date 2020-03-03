/* eslint-disable @typescript-eslint/no-explicit-any */
/* tslint:disable:no-any */
import { AssertionError } from 'assert';

export function assert(condition: any, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError({ message });
  }
}
