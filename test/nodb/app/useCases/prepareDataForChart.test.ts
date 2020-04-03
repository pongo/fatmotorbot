import { assert } from 'chai';
import { BMIFullResult, SuggestedNextDiff } from 'src/app/core/useCases/BMI/utils/types';
import {
  createChartQuery,
  prepareDataForChart,
  yyymmdd,
} from 'src/app/core/useCases/Weight/prepareDataForChart';
import { DataForChart } from 'src/app/core/useCases/Weight/types';
import { parseChartQuery } from 'src/app/shared/parseChartQuery';
import { BMI, kg, Kg, MeasuresFromNewestToOldest } from 'src/app/shared/types';
import { u } from 'test/utils';

describe('yyymmdd()', () => {
  it('should format date', () => {
    assert.equal(yyymmdd(new Date('2020-02-20')), '2020-2-20');
  });
});

describe('prepareDataForChart(', () => {
  const userId = u(1);
  it('empty', () => {
    const measures: MeasuresFromNewestToOldest<Kg> = [];
    const bmi = undefined;
    const expected: DataForChart = { userId, data: [], user: undefined };

    const actual = prepareDataForChart(userId, measures, bmi);
    assert.deepStrictEqual(actual, expected);
  });

  it('measures', () => {
    const measures: MeasuresFromNewestToOldest<Kg> = [
      { date: new Date('2019-12-19T21:00:00.000Z'), value: kg(55.7) },
      { date: new Date('2019-12-12T21:00:00.000Z'), value: kg(56.8) },
      { date: new Date('2019-12-05T21:00:00.000Z'), value: kg(57) },
      { date: new Date('2019-10-24T21:00:00.000Z'), value: kg(55.5) },
      { date: new Date('2019-10-17T21:00:00.000Z'), value: kg(55.1) },
      { date: new Date('2019-10-10T21:00:00.000Z'), value: kg(54.4) },
    ];
    const bmi = undefined;
    const expected: DataForChart = {
      userId,
      data: [...measures].reverse(),
      user: undefined,
    };

    const actual = prepareDataForChart(userId, measures, bmi);
    assert.deepStrictEqual(actual, expected);
  });

  describe('user', () => {
    function getBMI(toNext: SuggestedNextDiff | null = null, alreadyHealthy = false): BMIFullResult {
      const suggest = alreadyHealthy
        ? { alreadyHealthy }
        : {
            alreadyHealthy: false,
            toHealthy: kg(5),
            toNext,
          };
      return {
        case: 'bmi',
        bmi: 18.36 as BMI,
        categoryName: 'Underweight',
        healthyRange: [kg(58.83), kg(73.5)],
        suggest,
        ideal: { avg: kg(66), min: kg(63), max: kg(68) },
      };
    }

    it('health and ideal', () => {
      const measures: MeasuresFromNewestToOldest<Kg> = [];
      const bmi = getBMI();
      const expected: DataForChart = {
        userId,
        data: [],
        user: {
          health: { max: kg(73.5), min: kg(58.83) },
          ideal: { max: kg(68), min: kg(63) },
          next: undefined,
        },
      };

      const actual = prepareDataForChart(userId, measures, bmi);
      assert.deepStrictEqual(actual, expected);
    });

    it('next alreadyHealthy', () => {
      const measures: MeasuresFromNewestToOldest<Kg> = [];
      const bmi = getBMI(null, true);

      const actual = prepareDataForChart(userId, measures, bmi);
      assert(actual.user);
      assert.strictEqual(actual.user.next, undefined);
    });

    it('next', () => {
      const measures: MeasuresFromNewestToOldest<Kg> = [];
      const bmi = getBMI({
        categoryName: 'Severely underweight',
        diff: kg(6),
        nextWeight: kg(66),
      });

      const actual = prepareDataForChart(userId, measures, bmi);
      assert(actual.user);
      assert.strictEqual(actual.user.next, kg(66));
    });
  });
});

describe('create and parse ChartQuery', () => {
  const userId = u(10000000);
  const data = [
    { date: new Date('2019-10-10'), value: kg(54.4) },
    { date: new Date('2019-10-17'), value: kg(55.1) },
    { date: new Date('2019-12-19'), value: kg(55.7) },
  ];

  it('data without user', () => {
    const chart: DataForChart = { userId, data, user: undefined };
    const expected = `/10000000.png?d=2019-10-10_54.4!2019-10-17_55.1!2019-12-19_55.7`;
    const actual = createChartQuery(chart);
    assert.equal(actual, expected);
    assert.deepStrictEqual(parseChartQuery(actual), chart);
  });

  it('user without next', () => {
    const chart: DataForChart = {
      userId,
      data,
      user: {
        health: { min: kg(58.83), max: kg(73.5) },
        ideal: { min: kg(63), max: kg(68) },
        next: undefined,
      },
    };
    const expected = `/10000000.png?d=2019-10-10_54.4!2019-10-17_55.1!2019-12-19_55.7&h=58.83!73.5&i=63!68`;
    const actual = createChartQuery(chart);
    assert.equal(actual, expected);
    assert.deepStrictEqual(parseChartQuery(actual), chart);
  });

  it('user with next', () => {
    const chart: DataForChart = {
      userId,
      data,
      user: {
        health: { min: kg(58.83), max: kg(73.5) },
        ideal: { min: kg(63), max: kg(68) },
        next: kg(60),
      },
    };
    const expected = `/10000000.png?d=2019-10-10_54.4!2019-10-17_55.1!2019-12-19_55.7&h=58.83!73.5&i=63!68&n=60`;
    const actual = createChartQuery(chart);
    assert.equal(actual, expected);
    assert.deepStrictEqual(parseChartQuery(actual), chart);
  });

  it('should throw errors on invalid parsing', () => {
    assert.throw(() => parseChartQuery(''));
    assert.throw(() => parseChartQuery('/'));
    assert.throw(() => parseChartQuery('/1111'));
    assert.throw(() => parseChartQuery('/.png'));
    assert.throw(() => parseChartQuery('/dddd.png'));
    assert.throw(() => parseChartQuery('/?d=2019-10-10_54.4!2019-10-17_55.1'));
    assert.throw(() => parseChartQuery('/dddd.png?d=2019-10-10_54.4!2019-10-17_55.1'));
    assert.throw(() => parseChartQuery('/1111?d=2019-10-10_54.4!2019-10-17_55.1'));
    assert.throw(() => parseChartQuery('/.png?d=2019-10-10_54.4!2019-10-17_55.1'));

    assert.throw(() => parseChartQuery('/1.png?'));
    assert.throw(() => parseChartQuery('/1.png?k=111'));
    assert.throw(() => parseChartQuery('/1.png?d='));
    assert.throw(() => parseChartQuery('/1.png?d=2019-10-10_dddd!2019-10-17_55.1'));

    assert.throw(() => parseChartQuery('/1.png?d=2019-10-10_dddd!2019-10-17_55.1&h=58.83!73.5'));
    assert.throw(() => parseChartQuery('/1.png?d=2019-10-10_dddd!2019-10-17_55.1&h='));
    assert.throw(() => parseChartQuery('/1.png?d=2019-10-10_dddd!2019-10-17_55.1&h=58.83!73.5&h=58.83!73.5'));
    assert.throw(() => parseChartQuery('/1.png?d=2019-10-10_dddd!2019-10-17_55.1&h=dddd!73.5'));
  });
});
