import { assert } from 'chai';
import { SlonikError } from 'slonik';
import { getAddChartUrl, getChartUrl, getCurrentChartUrl } from 'src/app/bot/WeightCommand/presenters/chartUrl';
import { CurrentWeightDiff, DataForChart, WeightAdded, WeightCases } from 'src/app/core/useCases/Weight/types';
import { DatabaseError } from 'src/app/shared/errors';
import { kg } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';
import { u } from 'test/utils';

describe('chartUrl', () => {
  it('getChartUrl()', async () => {
    const userId = u(10000000);
    const data = [
      { date: new Date('2019-10-10'), value: kg(54.4) },
      { date: new Date('2019-10-17'), value: kg(55.1) },
      { date: new Date('2019-12-19'), value: kg(55.7) },
    ];
    const chart: DataForChart = { userId, data, user: undefined };

    assert.strictEqual(await getChartUrl(), undefined);
    assert.strictEqual(await getChartUrl(chart), undefined);
    assert.strictEqual(await getChartUrl(chart, ''), undefined);

    assert.strictEqual(
      await getChartUrl(chart, 'always200.now.sh'),
      'https://always200.now.sh/10000000.png?d=2019-10-10_54.4!2019-10-17_55.1!2019-12-19_55.7'
    );
  });

  it('getCurrentChartUrl()', async () => {
    assert.isUndefined(await getCurrentChartUrl(Result.err(new DatabaseError(new SlonikError()))));

    const data = ({ case: WeightCases.currentDiff } as unknown) as CurrentWeightDiff;
    assert.isUndefined(await getCurrentChartUrl(Result.ok(data)));
  });

  it('getAddChartUrl()', async () => {
    assert.isUndefined(await getAddChartUrl(Result.err(new DatabaseError(new SlonikError()))));

    const data = ({ case: WeightCases.addDiff } as unknown) as WeightAdded;
    assert.isUndefined(await getAddChartUrl(Result.ok(data)));
  });
});
