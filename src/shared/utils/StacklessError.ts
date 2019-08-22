/* tslint:disable:no-unnecessary-class no-require-imports no-unsafe-any */

export class StacklessError {
  name: string;

  constructor(public message: string, public data?: unknown) {
    this.name = 'StacklessError';
  }
}
require('util').inherits(StacklessError, Error);
