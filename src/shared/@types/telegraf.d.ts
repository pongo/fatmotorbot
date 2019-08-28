/* tslint:disable */
/* eslint-disable @typescript-eslint/tslint/config */
import * as tt from 'telegraf/typings/telegram-types';
import { TlsOptions } from 'tls';
import { Composer, ContextMessageUpdate } from 'telegraf';

declare module 'telegraf' {
  interface Telegraf<TContext extends ContextMessageUpdate> extends Composer<TContext> {
    launch(options?: {
      polling?: { timeout?: number; limit?: number; allowedUpdates?: tt.UpdateType[] };
      webhook?: { domain: string; webhookPath: string; tlsOptions: TlsOptions | null; port: number; host?: string };
    }): Promise<void>;
  }
}
