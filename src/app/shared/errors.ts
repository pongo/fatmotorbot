import { StacklessError } from '../../shared/utils/StacklessError';

export class InvalidFormatError extends StacklessError {
  constructor() {
    super('InvalidFormatError');
    this.name = 'InvalidFormatError';
  }
}
