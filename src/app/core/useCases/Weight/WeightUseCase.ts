import { IInfoRepositoryGet } from 'src/app/core/repositories/InfoRepository';
import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import { calcBMIFromWeight } from 'src/app/core/services/BMI/BMI';
import { BMIFullResult, BMIResultOrError } from 'src/app/core/services/BMI/utils/types';
import { measureDifference } from 'src/app/core/services/measureDifference';
import { validateWeight } from 'src/app/core/services/validators';
import { prepareDataForChart } from 'src/app/core/useCases/Weight/prepareDataForChart';
import {
  CurrentWeight,
  DataForChart,
  GetDataForChartPrepared,
  WeightAdded,
  WeightAddedErrors,
  WeightCases,
} from 'src/app/core/useCases/Weight/types';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { TelegramUserId } from 'src/app/shared/types';
import { parseNumber } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

export class WeightUseCase {
  constructor(
    private readonly weightRepository: IWeightRepository,
    private readonly infoRepository: IInfoRepositoryGet,
  ) {}

  async add(userId: TelegramUserId, date: Date, weightString: string): Promise<Result<WeightAdded, WeightAddedErrors>> {
    console.log(`WeightUseCase.add(${userId}, new Date('${date.toISOString()}'), \`${weightString}\`);`);

    const weight = validateWeight(parseNumber(weightString));
    if (weight == null) return Result.err(new InvalidFormatError());

    const previousMeasuresResult = await this.weightRepository.getAll(userId);
    if (previousMeasuresResult.isErr) return previousMeasuresResult;

    const addResult = await this.weightRepository.add(userId, weight, date);
    if (addResult.isErr) return addResult;

    const bmi = await calcBMIFromWeight(userId, weight, this.infoRepository);
    const previousMeasures = previousMeasuresResult.value;
    if (previousMeasures.length === 0) return Result.ok({ case: WeightCases.addFirst, weight, bmi });

    const diff = measureDifference({ date, value: weight }, previousMeasures);
    const chart = await this.getDataForChart(userId, { bmiResult: bmi });
    return Result.ok({ case: WeightCases.addDiff, diff, weight, bmi, chart });
  }

  async getCurrent(userId: TelegramUserId, now: Date): Promise<Result<CurrentWeight, DatabaseError>> {
    console.debug(`WeightUseCase.getCurrent(${userId}, new Date('${now.toISOString()}');`);

    const measuresResult = await this.weightRepository.getAll(userId);
    if (measuresResult.isErr) return measuresResult;

    const measures = measuresResult.value;
    if (measures.length === 0) return Result.ok({ case: WeightCases.currentEmpty });

    const current = measures[0];
    const bmi = await calcBMIFromWeight(userId, current.value, this.infoRepository);
    if (measures.length === 1) return Result.ok({ case: WeightCases.currentFirst, current, bmi });

    const diff = measureDifference(current, measures, now);
    const chart = await this.getDataForChart(userId, { measuresResult, bmiResult: bmi });
    return Result.ok({ case: WeightCases.currentDiff, diff, current, bmi, chart });
  }

  private async getDataForChart(
    userId: TelegramUserId,
    { measuresResult, bmiResult }: GetDataForChartPrepared,
  ): Promise<DataForChart | undefined> {
    console.debug(`WeightUseCase.getDataForChart(${userId});`);

    const measuresResult_ = measuresResult ?? (await this.weightRepository.getAll(userId));
    if (measuresResult_.isErr) return undefined;

    const measures = measuresResult_.value;
    if (measures.length === 0) return undefined;

    const bmi = getBMIValue(bmiResult);
    return prepareDataForChart(userId, measures, bmi);
  }
}

function getBMIValue(bmiResult: BMIResultOrError): BMIFullResult | undefined {
  if (bmiResult.isErr) return undefined;
  if (bmiResult.value.case !== 'bmi') return undefined;
  return bmiResult.value;
}
