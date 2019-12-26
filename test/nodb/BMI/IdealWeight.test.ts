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
} from 'src/app/bot/BMI/IdealWeight';
import { cm, kg } from 'src/app/shared/types';

describe('Ideal Weight calculation', () => {
  it('broca', () => {
    assert.equal(broca(cm(171), 'male'), kg(63.9));
    assert.equal(broca(cm(171), 'female'), kg(60.35));
  });

  it('brocaBrugsh', () => {
    assert.equal(brocaBrugsh(cm(171)), kg(66));
  });

  it('devine', () => {
    assert.equal(devine(cm(171), 'male'), kg(66.84));
    assert.equal(devine(cm(171), 'female'), kg(62.34));
  });

  it('robinson', () => {
    assert.equal(robinson(cm(171), 'male'), kg(65.91));
    assert.equal(robinson(cm(171), 'female'), kg(61.45));
  });

  it('miller', () => {
    assert.equal(miller(cm(171), 'male'), kg(66.53));
    assert.equal(miller(cm(171), 'female'), kg(63.06));
  });

  it('hamwi', () => {
    assert.equal(hamwi(cm(171), 'male'), kg(67.77));
    assert.equal(hamwi(cm(171), 'female'), kg(61.61));
  });

  it('lemmens', () => {
    assert.equal(lemmens(cm(171)), kg(64.33));
  });

  it('averageHealthyBMI', () => {
    assert.equal(averageHealthyBMI(cm(171), 'male'), kg(66.16));
    assert.equal(averageHealthyBMI(cm(171), 'female'), kg(63.23));
  });

  it('lorenz', () => {
    assert.equal(lorenz(cm(171), 'male'), kg(65.75));
    assert.equal(lorenz(cm(171), 'female'), kg(60.5));
  });

  it('mohammed', () => {
    assert.equal(mohammed(cm(171)), kg(65.79));
  });

  it('insurance', () => {
    assert.equal(insurance(cm(171)), kg(67));
  });

  it('kuper', () => {
    assert.equal(kuper(cm(171), 'male'), kg(63.92));
    assert.equal(kuper(cm(171), 'female'), kg(57.8));
  });

  it('breitman', () => {
    assert.equal(breitman(cm(171)), kg(69.7));
  });

  it('tetona', () => {
    assert.equal(tetona(cm(171), 'male'), kg(67.45));
    assert.equal(tetona(cm(171), 'female'), kg(63.9));
  });
});

describe('calcIdealWeight()', () => {
  it('should return average ideal weight', () => {
    assert.deepEqual(calcIdealWeight(cm(171), 'male'), { avg: 66, min: 63, max: 68 });
    assert.deepEqual(calcIdealWeight(cm(165), 'female'), { avg: 58, min: 54, max: 62 });
    assert.deepEqual(calcIdealWeight(cm(164), 'female'), { avg: 57, min: 53, max: 64 });
  });
});
