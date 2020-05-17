import { present } from 'src/app/bot/CheckCommand/present';
import { checkUseCase } from 'src/app/core/useCases/checkUseCase';
import { Command, TelegramGateway } from 'src/shared/infrastructure/TelegramGateway';

/**
 * Контроллер команды /check
 */
export class CheckCommandController {
  constructor(private readonly telegram: TelegramGateway) {}

  enable() {
    this.telegram.onCommand('check', this.handleCheck.bind(this));
    this.telegram.onCommand('bmi', this.handleCheck.bind(this));
    this.telegram.onCommand('imt', this.handleCheck.bind(this));
  }

  private async handleCheck(command: Command) {
    const msg = present(checkUseCase(command.args));
    await this.telegram.sendMessage(command.chatId, msg, command.messageId);
  }
}
