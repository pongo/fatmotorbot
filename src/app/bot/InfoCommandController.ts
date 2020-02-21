import { infoPresenter } from 'src/app/core/Info/infoPresenter';
import { InfoUseCase } from 'src/app/core/Info/InfoUseCase';
import { TelegramUserId } from 'src/app/shared/types';
import { Command, TelegramGateway } from 'src/shared/infrastructure/TelegramGateway';

/**
 * Контроллер команды /info
 */
export class InfoCommandController {
  constructor(private readonly usecase: InfoUseCase, private readonly telegram: TelegramGateway) {}

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
