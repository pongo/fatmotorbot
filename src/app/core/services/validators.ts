import { Cm, Gender, Kg } from 'src/app/shared/types';
import { parseNumber } from 'src/shared/utils/parseNumber';

/**
 * Проверяет правильно ли указан вес.
 */
export function validateWeight(value: number | null): Kg | null {
  if (value !== null && value >= 1 && value <= 999) return value as Kg;
  return null;
}

export function validateGender(genderStr: string): Gender | null {
  const lower = genderStr.toLowerCase();
  if (lower === 'м') return 'male';
  if (lower === 'ж') return 'female';
  return null;
}

export function validateHeight(heightStr: string): Cm | null {
  const value = parseNumber(heightStr);
  if (value != null && value >= 100 && value <= 300) return value as Cm;
  return null;
}
