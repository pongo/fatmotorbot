// this.commandsEE = new EventEmitter();

// https://github.com/telegraf/telegraf-command-parts/blob/master/index.js
const reCommandParts = /^\/([^@\s]+)@?(?:(\S+)|)\s?([\s\S]+)?$/i;

type StringWithoutAt = string;
type StringWithoutSlash = string;
type Command = {
  readonly fullText: string;
  readonly command: StringWithoutSlash;
  readonly bot?: StringWithoutAt;
  readonly argsText?: string;
  readonly args: string[];
};

export function parseCommand(text?: string | null): Command | null {
  if (text == null) return null;
  const parts = reCommandParts.exec(text.trim());
  if (parts == null) return null;
  return {
    fullText: text,
    command: parts[1],
    bot: parts[2],
    argsText: parts[3] == null ? undefined : parts[3].trim(),
    get args() {
      if (parts == null) return [];
      return parts[3] == null ? [] : parts[3].split(/\s+/).filter(arg => arg.length);
    },
  };
}
