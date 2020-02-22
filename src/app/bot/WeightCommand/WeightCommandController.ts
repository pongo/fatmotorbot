import { InfoRepository } from 'src/app/core/repositories/InfoRepository';
import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import { GetBMIUseCase } from 'src/app/core/useCases/BMI/GetBMIUseCase';
import { InfoUseCase } from 'src/app/core/useCases/Info/InfoUseCase';
import { weightPresenter } from 'src/app/bot/WeightCommand/weightPresenter';
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
  ) {
    const infoUseCase = new InfoUseCase(infoRepository, weightRepository);
    const bmiUseCase = new GetBMIUseCase(infoUseCase);
    this.usecase = new WeightUseCase(weightRepository, bmiUseCase);
  }

  enable() {
    this.telegram.onCommand('weight', this.weightHandler.bind(this));
    this.telegram.onCommand('w', this.weightHandler.bind(this));
  }

  private async weightHandler(command: Command) {
    const userId = command.from.id as TelegramUserId;
    const result =
      command.argsText.length === 0
        ? await this.usecase.getCurrent(userId, command.date)
        : await this.usecase.add(userId, command.date, command.argsText);

    const msg = weightPresenter(result, command.date);
    await this.telegram.sendMessage(command.chatId, msg, command.messageId);
  }
}
