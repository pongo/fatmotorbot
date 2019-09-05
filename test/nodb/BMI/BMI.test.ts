import { assert } from 'chai';
import { BMICategoryName, calcBMI, getBMICategory, getHealthyRange } from 'src/app/bot/BMI/BMI';
import { BMI, cm, kg } from 'src/app/shared/types';

describe('calcBMI()', () => {
  it('should calculate BMI', () => {
    const expected = [
      [140, 60, 33.63],
      [150, 60, 28.31],
      [160, 60, 24.09],
      [170, 60, 20.7],
      [180, 60, 17.94],
      [190, 60, 15.68],
      [200, 60, 13.79],
      [210, 60, 12.21],
      [180, 180, 53.83],
    ];
    const actual = expected.map(([height, weight]) => [height, weight, calcBMI(cm(height), kg(weight))]);
    assert.sameDeepOrderedMembers(expected, actual);
  });
});

describe('getBMICategory()', () => {
  it('should return category for females', () => {
    const expected: { [cat in BMICategoryName]: number[] } = {
      'Very severely underweight': [14],
      'Severely underweight': [15],
      Underweight: [16, 18],
      Normal: [19, 23],
      Overweight: [24, 29],
      'Obese I': [30, 34],
      'Obese II': [35, 39],
      'Obese III': [40, 44],
      'Obese IV': [45, 49],
      'Obese V': [50, 59],
      'Obese VI+': [60],
    };
    for (const [cat, values] of Object.entries(expected)) {
      for (const bmi of values) {
        assert.equal(getBMICategory('female', bmi as BMI), cat, `female ${bmi} BMI`);
      }
    }
  });

  it('should return category for males', () => {
    const expected: { [cat in BMICategoryName]: number[] } = {
      'Very severely underweight': [14],
      'Severely underweight': [15, 17],
      Underweight: [18, 19],
      Normal: [20, 24],
      Overweight: [25, 29],
      'Obese I': [30, 34],
      'Obese II': [35, 39],
      'Obese III': [40, 44],
      'Obese IV': [45, 49],
      'Obese V': [50, 59],
      'Obese VI+': [60],
    };
    for (const [cat, values] of Object.entries(expected)) {
      for (const bmi of values) {
        assert.equal(getBMICategory('male', bmi as BMI), cat, `male ${bmi} BMI`);
      }
    }
  });
});

describe('getHealthyRange()', () => {
  it('should return healthy range for height', () => {
    assert.deepEqual(getHealthyRange('male', cm(180)), [66.88, 83.59], 'male');
    assert.deepEqual(getHealthyRange('female', cm(180)), [63.53, 80.25], 'female');
  });
});
