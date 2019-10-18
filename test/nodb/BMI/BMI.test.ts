import { assert } from 'chai';
import { calcBMI, getBMICategoryName, getHealthyRange, getSuggestedWeightDiff } from 'src/app/bot/BMI/BMI';
import { BMICategoryName } from 'src/app/bot/BMI/BMICategory';
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

describe('getBMICategoryName()', () => {
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
        assert.equal(getBMICategoryName('female', bmi as BMI), cat, `female ${bmi} BMI`);
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
        assert.equal(getBMICategoryName('male', bmi as BMI), cat, `male ${bmi} BMI`);
      }
    }
  });
});

describe('getHealthyRange()', () => {
  it('should return healthy range for height', () => {
    assert.deepEqual(getHealthyRange('male', cm(180)), [66.88, 83.56], 'male');
    assert.deepEqual(getHealthyRange('female', cm(180)), [63.53, 80.22], 'female');
    assert.deepEqual(getHealthyRange('male', cm(175)), [62.33, 77.88], 'male');
  });
});

describe('getSuggestedWeightDiff()', () => {
  it('should return suggested weight loss or gain', () => {
    assert.deepEqual(
      getSuggestedWeightDiff('male', cm(200), kg(60)),
      {
        alreadyHealthy: false,
        toHealthy: kg(28),
        toNext: {
          categoryName: 'Severely underweight',
          diff: kg(6),
        },
      },
      '60 kg',
    );
    assert.deepEqual(
      getSuggestedWeightDiff('male', cm(200), kg(66)),
      {
        alreadyHealthy: false,
        toHealthy: kg(22),
        toNext: {
          categoryName: 'Underweight',
          diff: kg(13),
        },
      },
      '66 kg',
    );
    assert.deepEqual(
      getSuggestedWeightDiff('male', cm(200), kg(79)),
      {
        alreadyHealthy: false,
        toHealthy: kg(9),
        toNext: null,
      },
      '79 kg',
    );
    assert.deepEqual(
      getSuggestedWeightDiff('male', cm(200), kg(88)),
      {
        alreadyHealthy: true,
      },
      '88 kg',
    );
    assert.deepEqual(
      getSuggestedWeightDiff('male', cm(200), kg(115)),
      {
        alreadyHealthy: false,
        toHealthy: kg(-7),
        toNext: null,
      },
      '115 kg',
    );
    assert.deepEqual(
      getSuggestedWeightDiff('male', cm(200), kg(150)),
      {
        alreadyHealthy: false,
        toHealthy: kg(-42),
        toNext: {
          categoryName: 'Overweight',
          diff: kg(-19),
        },
      },
      '150 kg',
    );
  });
});
