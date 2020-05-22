"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCommand = exports.handleCommand = exports.TelegramGateway = void 0;
/* tslint:disable:no-submodule-imports */
const result_1 = require("src/shared/utils/result");
const telegraf_1 = __importDefault(require("telegraf"));
class TelegramGateway {
    constructor(token, telegrafLogs = false) {
        this.telegraf = new telegraf_1.default(token);
        // logging
        if (telegrafLogs)
            this.telegraf.use(telegraf_1.default.log());
    }
    async connect({ domain, webhookPath, port }) {
        const config = port == null || webhookPath == null || domain == null
            ? undefined
            : { webhook: { domain, webhookPath, port, tlsOptions: null } };
        return this.telegraf.launch(config);
    }
    onCommand(command, handler) {
        this.telegraf.command(command, async (ctx, next) => {
            return handleCommand(handler, ctx, next);
        });
    }
    onStartCommand(text) {
        this.telegraf.start(async (ctx) => {
            var _a;
            const isPrivate = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.from) != null && ctx.message.from.id === ctx.message.chat.id;
            if (isPrivate)
                return ctx.reply(text);
            return undefined;
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
    if ((ctx === null || ctx === void 0 ? void 0 : ctx.message) != null) {
        const parsedCommand = parseCommand(ctx.message);
        if (parsedCommand != null) {
            ctx.telegram.sendChatAction(parsedCommand.chatId, 'typing').catch(console.error);
            await handler(parsedCommand);
        }
    }
    if (next != null)
        return next();
    return undefined;
}
exports.handleCommand = handleCommand;
// https://github.com/telegraf/telegraf-command-parts/blob/master/index.js
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
            return parts[3].split(/\s+/).filter((arg) => arg.length);
        },
        messageId: message.message_id,
        date: new Date(message.date * 1000),
        chatId: message.chat.id,
        from: message.from,
    };
}
exports.parseCommand = parseCommand;
//# sourceMappingURL=TelegramGateway.js.map