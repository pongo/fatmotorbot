import { weightPresenter } from 'src/app/bot/WeightCommand/weightPresenter';
import { IWeightRepository } from 'src/app/bot/WeightCommand/WeightRepository';
import { WeightUseCase } from 'src/app/bot/WeightCommand/WeightUseCase';
import { TelegramUserId } from 'src/app/shared/types';
import { Command, TelegramGateway } from 'src/shared/infrastructure/TelegramGateway';

export class WeightCommand {
  private readonly usecase: WeightUseCase;

  constructor(private readonly repository: IWeightRepository, private readonly telegram: TelegramGateway) {
    this.usecase = new WeightUseCase(this.repository);
  }

  enable() {
    this.telegram.onCommand('weight', this.weightHandler.bind(this));
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
