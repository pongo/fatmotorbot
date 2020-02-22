import { IInfoRepository } from 'src/app/core/repositories/InfoRepository';
import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import { infoPresenter } from 'src/app/bot/InfoCommand/infoPresenter';
import { InfoUseCase } from 'src/app/core/useCases/Info/InfoUseCase';
import { TelegramUserId } from 'src/app/shared/types';
import { Command, TelegramGateway } from 'src/shared/infrastructure/TelegramGateway';

/**
 * Контроллер команды /info
 */
export class InfoCommandController {
  private readonly usecase: InfoUseCase;

  constructor(
    private readonly telegram: TelegramGateway,
    infoRepository: IInfoRepository,
    weightRepository: IWeightRepository,
  ) {
    this.usecase = new InfoUseCase(infoRepository, weightRepository);
  }

  enable() {
    this.telegram.onCommand('info', this.infoHandler.bind(this));
  }

  private async infoHandler(command: Command) {
    const userId = command.from.id as TelegramUserId;
    const result =
      command.argsText.length === 0 ? await this.usecase.get(userId) : await this.usecase.set(userId, command.args);

    const msg = infoPresenter(result);
    await this.telegram.sendMessage(command.chatId, msg, command.messageId);
  }
}
