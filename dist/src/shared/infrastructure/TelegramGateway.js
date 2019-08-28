"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reCommandParts = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i;
function parseCommand(text) {
    if (text == null)
        return null;
    const parts = reCommandParts.exec(text.trim());
    if (parts == null)
        return null;
    return {
        fullText: text,
        command: parts[1],
        bot: parts[2],
        argsText: parts[3] == null ? undefined : parts[3].trim(),
        get args() {
            if (parts == null)
                return [];
            return parts[3] == null ? [] : parts[3].split(/\s+/).filter(arg => arg.length);
        },
    };
}
exports.parseCommand = parseCommand;
//# sourceMappingURL=TelegramGateway.js.map