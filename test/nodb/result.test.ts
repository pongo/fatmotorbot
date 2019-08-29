import { assert } from 'chai';
import { Result } from '../../src/shared/utils/result';
import { StacklessError } from '../../src/shared/utils/StacklessError';

describe('Result', () => {
  it('ok()', () => {
    assert.deepEqual(Result.ok('hello'), { isOk: true, isErr: false, value: 'hello' });
  });

  it('err() with Error', () => {
    const error = new Error('hello');
    assert.deepEqual(Result.err(error), { isOk: false, isErr: true, error });
  });

  it('err() with string', () => {
    const error = new StacklessError('hello');
    assert.deepEqual(Result.err('hello'), { isOk: false, isErr: true, error });
  });

  it('err() with string and data', () => {
    const error = new StacklessError('hello', { name: 'world' });
    assert.deepEqual(Result.err('hello', { name: 'world' }), { isOk: false, isErr: true, error });
  });

  it('combine() with error', () => {
    assert.deepEqual(Result.combine([Result.ok('1'), Result.ok('2'), Result.err('3')]), Result.err('3'));
  });

  it('combine() without errors', () => {
    assert.deepEqual(Result.combine([Result.ok(1), Result.ok(2), Result.ok(3)]), Result.ok([1, 2, 3]));
    assert.deepEqual(Result.combine([]), Result.ok([]));
  });
});
