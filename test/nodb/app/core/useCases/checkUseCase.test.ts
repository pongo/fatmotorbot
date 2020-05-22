import { assert } from 'chai';
import { BMIResult } from 'src/app/core/services/BMI/utils/types';
import { CheckResult, checkUseCase } from 'src/app/core/useCases/checkUseCase';
import { BMI, cm, kg } from 'src/app/shared/types';

describe('checkUseCase()', () => {
  describe('should return error on wrong args', () => {
    it('wrong number of args', () => {
      assert.isTrue(checkUseCase(['ж', '170']).isErr);
      assert.isTrue(checkUseCase(['ж']).isErr);
      assert.isTrue(checkUseCase([]).isErr);
    });

    it('wrong values of args', () => {
      assert.isTrue(checkUseCase(['ж', '170', '0']).isErr);
      assert.isTrue(checkUseCase(['ж', '0', '55']).isErr);
      assert.isTrue(checkUseCase(['0', '170', '55']).isErr);
    });
  });

  describe('should return result on correct args', () => {
    it('male', () => {
      const bmiResult: BMIResult = {
        bmi: 18.98 as BMI,
        case: 'bmi',
        categoryName: 'Underweight',
        healthyRange: [kg(57.97), kg(72.43)],
        ideal: {
          avg: kg(65),
          max: kg(67),
          min: kg(63),
        },
        suggest: {
          alreadyHealthy: false,
          toHealthy: kg(3),
          toNext: null,
        },
      };
      const expected = {
        params: {
          userInfo: {
            gender: 'male' as const,
            height: cm(170),
          },
          weight: kg(55),
        },
        bmiResult,
      };

      const actual = checkUseCase(['м', '170', '55']);

      assert(actual.isOk);
      assert.deepStrictEqual(actual.value, expected);
    });
  });

  it('female', () => {
    const actual = checkUseCase(['ж', '170', '55']);

    assert(actual.isOk);
    assert.deepStrictEqual(actual.value.params, { weight: kg(55), userInfo: { gender: 'female', height: cm(170) } });
    assert(actual.value.bmiResult.case === 'bmi');
    assert.strictEqual(actual.value.bmiResult.bmi, 18.98 as BMI);
  });

  it('floating weight ', () => {
    assert.strictEqual(getParams(checkUseCase(['м', '170', '55,7'])).weight, kg(55.7));
    assert.strictEqual(getParams(checkUseCase(['ж', '170', '55.7'])).weight, kg(55.7));
  });
});

function getParams(actual: CheckResult) {
  assert(actual.isOk);
  return actual.value.params;
}
