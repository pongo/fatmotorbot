import { getAddChartUrl, getCurrentChartUrl } from 'src/app/bot/WeightCommand/presenters/chartUrl';
import { presentAddWeight } from 'src/app/bot/WeightCommand/presenters/presentAddWeight';
import { presentCurrentWeight } from 'src/app/bot/WeightCommand/presenters/presentCurrentWeight';
import { InfoRepository } from 'src/app/core/repositories/InfoRepository';
import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import { WeightUseCase } from 'src/app/core/useCases/Weight/WeightUseCase';
import { TelegramUserId } from 'src/app/shared/types';
import { Command, ITelegramGateway } from 'src/shared/infrastructure/TelegramGateway';

/**
 * Контроллер команды /weight
 */
export class WeightCommandController {
  private readonly usecase: WeightUseCase;

  constructor(
    private readonly telegram: ITelegramGateway,
    weightRepository: IWeightRepository,
    infoRepository: InfoRepository,
    private readonly chartDomain?: string,
  ) {
    this.usecase = new WeightUseCase(weightRepository, infoRepository);
  }

  enable() {
    this.telegram.onCommand('weight', this.handleWeight.bind(this));
    this.telegram.onCommand('w', this.handleWeight.bind(this));
  }

  async handleWeight(command: Command) {
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
