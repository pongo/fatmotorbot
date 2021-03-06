import envalid, { host, port, str } from 'envalid';

type Config = {
  DATABASE_URL: string;
  BOT_TOKEN: string;

  BOT_WEBHOOK_DOMAIN?: string;
  BOT_WEBHOOK_PATH?: string;
  PORT?: number;

  CHART_DOMAIN?: string;

  isProduction: boolean;
  isTest: boolean;
  isDev: boolean;
};

export function parseConfig(): Readonly<Config> {
  return envalid.cleanEnv(
    process.env,
    {
      DATABASE_URL: str(),
      BOT_TOKEN: str(),

      BOT_WEBHOOK_DOMAIN: host({ default: undefined }),
      BOT_WEBHOOK_PATH: str({ default: undefined }),
      PORT: port({ default: undefined }),

      CHART_DOMAIN: host({ default: undefined }),
    },
    {
      /* istanbul ignore next */
      dotEnvPath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }
  );
}
