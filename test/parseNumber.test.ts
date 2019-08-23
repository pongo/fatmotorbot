import { expect } from 'chai';
import { parseNumber } from 'src/shared/utils/parseNumber';

describe('parseNumber()', () => {
  it('should parse single value', () => {
    expect(parseNumber('10')).to.equal(10);
    expect(parseNumber('10.0')).to.equal(10);
    expect(parseNumber('10.00')).to.equal(10);
    expect(parseNumber('55.5')).to.equal(55.5);
    expect(parseNumber('33.3333333333333333')).to.equal(33.33);
    expect(parseNumber('33.38888888888888888')).to.equal(33.39);
    expect(parseNumber('99999999')).to.equal(99999999);
    expect(parseNumber('55.')).to.equal(55);
    expect(parseNumber('55..5')).to.equal(55);
  });

  it('should parse value with texts', () => {
    expect(parseNumber('  мой вес 55.5 кг  ')).to.equal(55.5);
    expect(parseNumber('55.5кг')).to.equal(55.5);
    expect(parseNumber('55.5.кг')).to.equal(55.5);
    expect(parseNumber('55.kg')).to.equal(55);
    expect(parseNumber('55. 3kg')).to.equal(55);
  });

  it('should parse value with ","', () => {
    expect(parseNumber('55,5')).to.equal(55.5);
  });

  it('should parse value with "+-"', () => {
    expect(parseNumber('+55.5')).to.equal(55.5);
    expect(parseNumber('-55')).to.equal(-55);
    expect(parseNumber('−55')).to.equal(-55);
  });

  it('should return null on error', () => {
    expect(parseNumber('')).to.null;
    expect(parseNumber('-')).to.null;
    expect(parseNumber('Infinity')).to.null;
  });
});
