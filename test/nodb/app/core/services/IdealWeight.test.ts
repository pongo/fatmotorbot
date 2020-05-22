import { assert } from 'chai';
import {
  averageHealthyBMI,
  breitman,
  broca,
  brocaBrugsh,
  calcIdealWeight,
  devine,
  hamwi,
  insurance,
  kuper,
  lemmens,
  lorenz,
  miller,
  mohammed,
  robinson,
  tetona,
} from 'src/app/core/services/IdealWeight';
import { cm, kg } from 'src/app/shared/types';

describe('Ideal Weight calculation', () => {
  it('broca', () => {
    assert.strictEqual(broca(cm(171), 'male'), kg(63.9));
    assert.strictEqual(broca(cm(171), 'female'), kg(60.35));
  });

  it('brocaBrugsh', () => {
    assert.strictEqual(brocaBrugsh(cm(171)), kg(66));
  });

  it('devine', () => {
    assert.strictEqual(devine(cm(171), 'male'), kg(66.84));
    assert.strictEqual(devine(cm(171), 'female'), kg(62.34));
  });

  it('robinson', () => {
    assert.strictEqual(robinson(cm(171), 'male'), kg(65.91));
    assert.strictEqual(robinson(cm(171), 'female'), kg(61.45));
  });

  it('miller', () => {
    assert.strictEqual(miller(cm(171), 'male'), kg(66.53));
    assert.strictEqual(miller(cm(171), 'female'), kg(63.06));
  });

  it('hamwi', () => {
    assert.strictEqual(hamwi(cm(171), 'male'), kg(67.77));
    assert.strictEqual(hamwi(cm(171), 'female'), kg(61.61));
  });

  it('lemmens', () => {
    assert.strictEqual(lemmens(cm(171)), kg(64.33));
  });

  it('averageHealthyBMI', () => {
    assert.strictEqual(averageHealthyBMI(cm(171), 'male'), kg(66.16));
    assert.strictEqual(averageHealthyBMI(cm(171), 'female'), kg(63.23));
  });

  it('lorenz', () => {
    assert.strictEqual(lorenz(cm(171), 'male'), kg(65.75));
    assert.strictEqual(lorenz(cm(171), 'female'), kg(60.5));
  });

  it('mohammed', () => {
    assert.strictEqual(mohammed(cm(171)), kg(65.79));
  });

  it('insurance', () => {
    assert.strictEqual(insurance(cm(171)), kg(67));
  });

  it('kuper', () => {
    assert.strictEqual(kuper(cm(171), 'male'), kg(63.92));
    assert.strictEqual(kuper(cm(171), 'female'), kg(57.8));
  });

  it('breitman', () => {
    assert.strictEqual(breitman(cm(171)), kg(69.7));
  });

  it('tetona', () => {
    assert.strictEqual(tetona(cm(171), 'male'), kg(67.45));
    assert.strictEqual(tetona(cm(171), 'female'), kg(63.9));
  });
});

describe('calcIdealWeight()', () => {
  it('should return average ideal weight', () => {
    assert.deepStrictEqual(calcIdealWeight(cm(171), 'male'), { avg: 66, min: 63, max: 68 });
    assert.deepStrictEqual(calcIdealWeight(cm(165), 'female'), { avg: 58, min: 54, max: 62 });
    assert.deepStrictEqual(calcIdealWeight(cm(164), 'female'), { avg: 57, min: 53, max: 64 });
  });
});
