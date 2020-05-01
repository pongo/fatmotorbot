import { Result } from 'src/shared/utils/result';
import Telegraf, { ContextMessageUpdate } from 'telegraf';
import * as TT from 'telegram-typings';

type CommandHandler = (command: Command) => void | Promise<void>;
type TelegramMessageId = number;

export class TelegramGateway {
  private readonly telegraf: Telegraf<ContextMessageUpdate>;

  constructor(token: string, telegrafLogs = false) {
    this.telegraf = new Telegraf(token);

    // logging
    if (telegrafLogs) this.telegraf.use(Telegraf.log());
  }

  async connect({ domain, webhookPath, port }: { domain?: string; webhookPath?: string; port?: number }) {
    const config =
      port == null || webhookPath == null || domain == null
        ? undefined
        : { webhook: { domain, webhookPath, port, tlsOptions: null } };
    return this.telegraf.launch(config);
  }

  onCommand(command: StringWithoutSlash, handler: CommandHandler) {
    this.telegraf.command(command, async (ctx, next) => {
      return handleCommand(handler, ctx, next);
    });
  }

  onStartCommand(text: string) {
    this.telegraf.start(async (ctx) => {
      const isPrivate = ctx.message != null && ctx.message.from != null && ctx.message.from.id === ctx.message.chat.id;
      if (isPrivate) return ctx.reply(text);
      return undefined;
    });
  }

  async sendMessage(
    chatId: number,
    text: string,
    reply_to_message_id?: TelegramMessageId,
  ): Promise<Result<TelegramMessageId>> {
    try {
      const message = await this.telegraf.telegram.sendMessage(chatId, text, {
        reply_to_message_id,
        parse_mode: 'HTML',
      });
      return Result.ok(message.message_id);
    } catch (e) {
      console.error('TelegramGateway.sendMessage()', e);
      return Result.err(e);
    }
  }
}

export async function handleCommand(handler: CommandHandler, ctx: ContextMessageUpdate, next?: Function) {
  if (ctx != null && ctx.message != null) {
    const parsedCommand = parseCommand(ctx.message);
    if (parsedCommand != null) {
      ctx.telegram.sendChatAction(parsedCommand.chatId, 'typing').catch(console.error);
      await handler(parsedCommand);
    }
  }
  if (next != null) return next();
  return undefined;
}

// https://github.com/telegraf/telegraf-command-parts/blob/master/index.js
const reCommandParts = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i;

type StringWithoutAt = string;
type StringWithoutSlash = string;
export type Command = {
  readonly fullText: string;
  readonly command: StringWithoutSlash;
  readonly bot?: StringWithoutAt;
  readonly argsText: string;
  readonly args: string[];
  readonly messageId: TelegramMessageId;
  readonly from: TT.User;
  readonly date: Date;
  readonly chatId: number;
};

export function parseCommand(message: TT.Message): Command | null {
  if (message.text == null || message.forward_date != null || message.from == null) return null;

  const parts = reCommandParts.exec(message.text.trim());
  if (parts == null) return null;

  return {
    fullText: message.text,
    command: parts[1],
    bot: parts[2],
    argsText: parts[3] == null ? '' : parts[3].trim(),
    get args() {
      if (parts == null || parts[3] == null) return [];
      return parts[3].split(/\s+/).filter((arg) => arg.length);
    },
    messageId: message.message_id,
    date: new Date(message.date * 1000),
    chatId: message.chat.id,
    from: message.from,
  };
}
