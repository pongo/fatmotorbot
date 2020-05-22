import {
  CommandHandler,
  ITelegramGateway,
  StringWithoutSlash,
  TelegramMessageId,
} from 'src/shared/infrastructure/TelegramGateway';
import { Result } from 'src/shared/utils/result';
import { toTimestamp } from 'src/shared/utils/utils';
import * as TT from 'telegram-typings';

export type SendMessage = {
  chatId: number;
  text: string;
  reply_to_message_id?: TelegramMessageId;
  // date: Date;
  // from: number;
  // messageId: TelegramMessageId;
};

export class TelegramMock implements ITelegramGateway {
  sendMessages: SendMessage[] = [];
  handlers = new Map<StringWithoutSlash, CommandHandler[]>();
  lastMessageId = 0;

  get lastSendMessageText() {
    return this.sendMessages[this.sendMessages.length - 1]?.text;
  }

  reset() {
    this.sendMessages = [];
    this.lastMessageId = 0;
  }

  onCommand(command: StringWithoutSlash, handler: CommandHandler) {
    const handlers = this.handlers.get(command) ?? [];
    handlers.push(handler);
    this.handlers.set(command, handlers);
  }

  // eslint-disable-next-line
  onStartCommand() {}

  async sendMessage(
    chatId: number,
    text: string,
    reply_to_message_id?: TelegramMessageId,
  ): Promise<Result<TelegramMessageId>> {
    this.sendMessages.push({ chatId, text, reply_to_message_id });
    return Promise.resolve(Result.ok(this.nextMessageId()));
  }

  createMsg({
    date = new Date(),
    text,
    chatId = -1,
    fromId = 1,
  }: {
    date?: Date;
    text?: string;
    chatId?: number;
    fromId?: number;
  }): TT.Message {
    return ({
      text,
      message_id: this.nextMessageId(),
      from: { id: fromId },
      chat: { id: chatId },
      date: toTimestamp(date),
    } as unknown) as TT.Message;
  }

  private nextMessageId() {
    this.lastMessageId += 1;
    return this.lastMessageId;
  }
}
