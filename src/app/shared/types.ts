type Brand<K, T> = K & { __brand: T };

export type TelegramUserId = Brand<number, 'TelegramUserId'>;
export type Kg = Brand<number, 'Kg'>;

export type Measure<T extends number> = [Date, T];

export const kg = (value: number) => value as Kg;
