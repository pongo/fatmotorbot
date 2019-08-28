import envalid, { str } from 'envalid';

type Config = {
  DATABASE_URL: string;
  BOT_TOKEN: string;
  isProduction: boolean;
  isTest: boolean;
  isDev: boolean;
};

export function parseConfig(): Readonly<Config> {
  return envalid.cleanEnv(process.env, {
    DATABASE_URL: str(),
    BOT_TOKEN: str(),
  });
}
