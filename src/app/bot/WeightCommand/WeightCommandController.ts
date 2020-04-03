import { getAddChartUrl, presentAddWeight } from 'src/app/bot/WeightCommand/presenters/presentAddWeight';
import { getCurrentChartUrl, presentCurrentWeight } from 'src/app/bot/WeightCommand/presenters/presentCurrentWeight';
import { InfoRepository } from 'src/app/core/repositories/InfoRepository';
import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import { GetBMIUseCase } from 'src/app/core/useCases/BMI/GetBMIUseCase';
import { InfoUseCase } from 'src/app/core/useCases/Info/InfoUseCase';
import { WeightUseCase } from 'src/app/core/useCases/Weight/WeightUseCase';
import { TelegramUserId } from 'src/app/shared/types';
import { Command, TelegramGateway } from 'src/shared/infrastructure/TelegramGateway';

/**
 * Контроллер команды /weight
 */
export class WeightCommandController {
  private readonly usecase: WeightUseCase;

  constructor(
    private readonly telegram: TelegramGateway,
    weightRepository: IWeightRepository,
    infoRepository: InfoRepository,
    private readonly chartDomain?: string,
  ) {
    const infoUseCase = new InfoUseCase(infoRepository, weightRepository);
    const bmiUseCase = new GetBMIUseCase(infoUseCase, weightRepository);
    this.usecase = new WeightUseCase(weightRepository, bmiUseCase);
  }

  enable() {
    this.telegram.onCommand('weight', this.weightHandler.bind(this));
    this.telegram.onCommand('w', this.weightHandler.bind(this));
  }

  private async weightHandler(command: Command) {
    const userId = command.from.id as TelegramUserId;
    const msg =
      command.argsText.length === 0
        ? await _current(this.usecase, this.chartDomain)
        : await _add(this.usecase, this.chartDomain);
    await this.telegram.sendMessage(command.chatId, msg, command.messageId);

    async function _current(usecase: WeightUseCase, chartDomain?: string): Promise<string> {
      const result = await usecase.getCurrent(userId, command.date);
      const chartUrl = await getCurrentChartUrl(result, chartDomain);
      return presentCurrentWeight(result, command.date, chartUrl);
    }

    async function _add(usecase: WeightUseCase, chartDomain?: string): Promise<string> {
      const result = await usecase.add(userId, command.date, command.argsText);
      const chartUrl = await getAddChartUrl(result, chartDomain);
      return presentAddWeight(result, chartUrl);
    }
  }
}
