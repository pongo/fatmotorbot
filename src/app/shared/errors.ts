import { SlonikError } from 'slonik';
import { StacklessError } from 'src/shared/utils/StacklessError';

export class InvalidFormatError extends StacklessError {
  constructor() {
    super('InvalidFormatError');
    this.name = 'InvalidFormatError';
  }
}

export class DatabaseError extends StacklessError {
  constructor(readonly slonikError: SlonikError) {
    super('DatabaseError');
    this.name = 'DatabaseError';
    this.message = slonikError.message;
  }
}
