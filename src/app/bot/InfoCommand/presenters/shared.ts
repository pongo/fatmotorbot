import { UserInfo } from 'src/app/core/repositories/InfoRepository';

export function presentUserData(data: UserInfo): string {
  const gender = data.gender === 'female' ? 'Женщина' : 'Мужчина';
  return `${gender}, ${data.height} см`;
}
