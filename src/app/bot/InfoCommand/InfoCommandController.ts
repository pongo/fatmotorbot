import { presentGetInfo } from 'src/app/bot/InfoCommand/presenters/presentGetInfo';
import { presentSetInfo } from 'src/app/bot/InfoCommand/presenters/presentSetInfo';
import { IInfoRepository } from 'src/app/core/repositories/InfoRepository';
import { IWeightRepository } from 'src/app/core/repositories/WeightRepository';
import { InfoUseCase } from 'src/app/core/useCases/Info/InfoUseCase';
import { TelegramUserId } from 'src/app/shared/types';
import { Command, ITelegramGateway } from 'src/shared/infrastructure/TelegramGateway';

/**
 * Контроллер команды /info
 */
export class InfoCommandController {
  private readonly usecase: InfoUseCase;

  constructor(
    private readonly telegram: ITelegramGateway,
    infoRepository: IInfoRepository,
    weightRepository: IWeightRepository,
  ) {
    this.usecase = new InfoUseCase(infoRepository, weightRepository);
  }

  enable() {
    this.telegram.onCommand('info', this.handleInfo.bind(this));
  }

  async handleInfo(command: Command) {
    const userId = command.from.id as TelegramUserId;
    const msg =
      command.argsText.length === 0
        ? presentGetInfo(await this.usecase.get(userId))
        : presentSetInfo(await this.usecase.set(userId, command.args));
    await this.telegram.sendMessage(command.chatId, msg, command.messageId);
  }
}
