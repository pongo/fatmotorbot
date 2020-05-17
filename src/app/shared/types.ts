type Brand<K, T> = K & { __brand: T };

export type TelegramUserId = Brand<number, 'TelegramUserId'>;
export type Kg = Brand<number, 'Kg'>;
export type Cm = Brand<number, 'Cm'>;
export type BMI = Brand<number, 'BMI'>;

export type Gender = 'male' | 'female';

export type Measure<T extends number> = { date: Date; value: T };

export const kg = (value: number) => value as Kg;
export const cm = (value: number) => value as Cm;

export type MeasureValueType = 'weight' | 'none';
export type MeasuresFromNewestToOldest<T extends number> = Measure<T>[];
export type MeasuresFromOldestToNewest<T extends number> = Measure<T>[];

export type IdealWeight = {
  avg: Kg;
  min: Kg;
  max: Kg;
};
