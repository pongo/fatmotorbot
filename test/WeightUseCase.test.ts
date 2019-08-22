import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { validateWeight, WeightUseCase } from 'src/app/bot/WeightCommand/WeightUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { Kg, TelegramUserId } from 'src/app/shared/modelTypes';
import { Result } from 'src/shared/utils/result';

chai.use(sinonChai);

const u = (id: number) => id as TelegramUserId;
const kg = (value: number) => value as Kg;

describe('WeightUseCase', () => {
  describe('add()', () => {
    it('should adds valid weight to db', async () => {
      const repository = { add: sinon.fake() };
      const usecase = new WeightUseCase(repository);

      const actual = await usecase.add(u(1), '10');

      expect(actual.isOk).to.true;
      expect(repository.add).calledOnceWith(u(1), kg(10));
    });

    it('should return error on invalid weight', async () => {
      const repository = { add: sinon.fake() };
      const usecase = new WeightUseCase(repository);

      const actual = await usecase.add(u(1), '');

      expect(actual).deep.equal(Result.err(new InvalidFormatError()));
      expect(repository.add, 'repository').not.called;
      sinon.assert.notCalled(repository.add);
    });
  });
});

describe('isValidWeight()', () => {
  it('value should be not null', () => {
    expect(validateWeight(null)).to.null;
  });

  it('value should be >= 1 and <= 500', () => {
    expect(validateWeight(0)).to.null;
    expect(validateWeight(-100)).to.null;
    expect(validateWeight(501)).to.null;

    expect(validateWeight(50.5)).to.equal(50.5);
  });
});
