import { assert } from 'chai';
import sinon from 'sinon';
import { validateWeight, WeightUseCase } from 'src/app/bot/WeightCommand/WeightUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { Kg, TelegramUserId } from 'src/app/shared/types';

const u = (id: number) => id as TelegramUserId;
const kg = (value: number) => value as Kg;

describe('WeightUseCase', () => {
  describe('add()', () => {
    it('should adds valid weight to db', async () => {
      const repository = { add: sinon.fake() };
      const usecase = new WeightUseCase(repository);

      const actual = await usecase.add(u(1), '10');

      assert.isTrue(actual.isOk);
      sinon.assert.calledOnce(repository.add);
      sinon.assert.calledWith(repository.add, u(1), kg(10));
    });

    it('should return error on invalid weight', async () => {
      const repository = { add: sinon.fake() };
      const usecase = new WeightUseCase(repository);

      const actual = await usecase.add(u(1), '');

      if (actual.isOk) throw Error();
      assert.instanceOf(actual.error, InvalidFormatError);
      sinon.assert.notCalled(repository.add);
    });
  });
});

describe('isValidWeight()', () => {
  it('value should be not null', () => {
    assert.isNull(validateWeight(null));
  });

  it('value should be >= 1 and <= 500', () => {
    assert.isNull(validateWeight(0));
    assert.isNull(validateWeight(-100));
    assert.isNull(validateWeight(501));

    assert.equal(validateWeight(50.5), kg(50.5));
  });
});
