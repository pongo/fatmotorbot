import { present } from 'src/app/bot/CheckCommand/checkPresenter';
import { checkUseCase } from 'src/app/core/useCases/checkUseCase';
import { Command, ITelegramGateway } from 'src/shared/infrastructure/TelegramGateway';

/**
 * Контроллер команды /check
 */
export class CheckCommandController {
  constructor(private readonly telegram: ITelegramGateway) {}

  enable() {
    this.telegram.onCommand('check', this.handleCheck.bind(this));
    this.telegram.onCommand('bmi', this.handleCheck.bind(this));
    this.telegram.onCommand('imt', this.handleCheck.bind(this));
  }

  async handleCheck(command: Command) {
    const msg = present(checkUseCase(command.args));
    await this.telegram.sendMessage(command.chatId, msg, command.messageId);
  }
}
