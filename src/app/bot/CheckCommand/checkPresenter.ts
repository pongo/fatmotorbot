import { bmiPresenter } from 'src/app/bot/presenters/bmiPresenter';
import { CheckResult } from 'src/app/core/useCases/checkUseCase';
import { Result } from 'src/shared/utils/result';

const HELP = `
Укажи данные командой: /check пол рост вес, где:
• пол — м или ж
• рост в см
• вес в кг

Пример: /check ж 164 45
Альтернатива: /bmi или /imt`.trim();

export function present(result: CheckResult): string {
  if (result.isErr) return HELP;

  const { bmiResult, params } = result.value;
  const bmi = bmiPresenter(Result.ok(bmiResult));
  const gender = params.userInfo.gender === 'male' ? 'Мужчина' : 'Женщина';

  return `
${gender}, ${params.userInfo.height} см, ${params.weight} кг.

${bmi}
`.trim();
}
