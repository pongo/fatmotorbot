"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const result_1 = require("src/shared/utils/result");
const telegraf_1 = __importDefault(require("telegraf"));
class TelegramGateway {
    constructor(token, telegrafLogs = false) {
        this.telegraf = new telegraf_1.default(token);
        if (telegrafLogs)
            this.telegraf.use(telegraf_1.default.log());
    }
    async connect() {
        return this.telegraf.launch();
    }
    onCommand(command, handler) {
        this.telegraf.command(command, async (ctx, next) => {
            return handleCommand(handler, ctx, next);
        });
    }
    async sendMessage(chatId, text, reply_to_message_id) {
        try {
            const message = await this.telegraf.telegram.sendMessage(chatId, text, {
                reply_to_message_id,
                parse_mode: 'HTML',
            });
            return result_1.Result.ok(message.message_id);
        }
        catch (e) {
            console.error('TelegramGateway.sendMessage()', e);
            return result_1.Result.err(e);
        }
    }
}
exports.TelegramGateway = TelegramGateway;
async function handleCommand(handler, ctx, next) {
    if (ctx != null && ctx.message != null) {
        const parsedCommand = parseCommand(ctx.message);
        if (parsedCommand != null)
            await handler(parsedCommand);
    }
    if (next != null)
        return next();
    return undefined;
}
exports.handleCommand = handleCommand;
const reCommandParts = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i;
function parseCommand(message) {
    if (message.text == null || message.forward_date != null || message.from == null)
        return null;
    const parts = reCommandParts.exec(message.text.trim());
    if (parts == null)
        return null;
    return {
        fullText: message.text,
        command: parts[1],
        bot: parts[2],
        argsText: parts[3] == null ? '' : parts[3].trim(),
        get args() {
            if (parts == null || parts[3] == null)
                return [];
            return parts[3].split(/\s+/).filter(arg => arg.length);
        },
        messageId: message.message_id,
        date: new Date(message.date * 1000),
        chatId: message.chat.id,
        from: message.from,
    };
}
exports.parseCommand = parseCommand;
//# sourceMappingURL=TelegramGateway.js.map