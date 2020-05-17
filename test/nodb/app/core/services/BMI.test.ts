import { assert } from 'chai';
import sinon from 'sinon';
import { IInfoRepository, UserInfo } from 'src/app/core/repositories/InfoRepository';
import { calcBMI, calcBMIFromUserInfo, calcBMIFromWeight } from 'src/app/core/services/BMI/BMI';
import {
  getBMICategoryName,
  getHealthyRange,
  getSuggestedWeightDiff,
} from 'src/app/core/services/BMI/utils/BMICategory';
import { BMICategoryName, BMIResult } from 'src/app/core/services/BMI/utils/types';
import { calcBMIValue } from 'src/app/core/services/BMI/utils/utils';
import { BMI, cm, kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { InfoRepositoryMockSinon, WeightRepositoryMockSinon } from 'test/repositoryMocks';
import { u } from 'test/utils';

describe('calcBMIValue()', () => {
  it('should calculate BMI value', () => {
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
    const actual = expected.map(([height, weight]) => [height, weight, calcBMIValue(cm(height), kg(weight))]);
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
          nextWeight: kg(66),
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
          nextWeight: kg(79),
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
          nextWeight: kg(131),
        },
      },
      '150 kg',
    );
  });
});

describe('BMI full report', () => {
  const userInfo: UserInfo = { gender: 'male', height: cm(171) };
  const expected: BMIResult = {
    case: 'bmi',
    bmi: 18.36 as BMI,
    categoryName: 'Underweight',
    healthyRange: [kg(58.83), kg(73.5)],
    suggest: {
      alreadyHealthy: false,
      toHealthy: kg(5),
      toNext: null,
    },
    ideal: { avg: kg(66), min: kg(63), max: kg(68) },
  };

  it('no user info', async () => {
    const infoRepository: IInfoRepository = { set: sinon.fake.throws(''), get: async () => Result.ok(null) };
    const actual = await calcBMIFromWeight(u(1), kg(54), infoRepository);
    assert.deepEqual(actual, Result.ok({ case: 'need-user-info' as const }));
  });

  it('calcBMIFromUserInfo()', async () => {
    const weightRepo = WeightRepositoryMockSinon({ getCurrent: Result.ok(kg(54)) });
    const actual = await calcBMIFromUserInfo(u(1), userInfo, weightRepo);
    assert.deepEqual(actual, Result.ok(expected));
  });

  it('calcBMIFromWeight()', async () => {
    const infoRepository = InfoRepositoryMockSinon({ get: Result.ok(userInfo) });
    const actual = await calcBMIFromWeight(u(1), kg(54), infoRepository);
    assert.deepEqual(actual, Result.ok(expected));
  });

  it('calcBMI()', () => {
    const actual = calcBMI(kg(54), userInfo);
    assert.deepEqual(actual, expected);
  });
});
