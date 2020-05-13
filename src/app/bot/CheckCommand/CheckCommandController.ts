import { bmiPresenter } from 'src/app/bot/presenters/bmiPresenter';
import { UserInfo } from 'src/app/core/repositories/InfoRepository';
import { calcBMIResult } from 'src/app/core/useCases/BMI/GetBMIUseCase';
import { Kg } from 'src/app/shared/types';
import { validateGender, validateHeight, validateWeight } from 'src/app/shared/validators';
import { Command, TelegramGateway } from 'src/shared/infrastructure/TelegramGateway';
import { parseNumber } from 'src/shared/utils/parseNumber';
import { Result } from 'src/shared/utils/result';

/**
 * Контроллер команды /check
 */
export class CheckCommandController {
  constructor(private readonly telegram: TelegramGateway) {}

  enable() {
    this.telegram.onCommand('check', this.handleCheck.bind(this));
    this.telegram.onCommand('bmi', this.handleCheck.bind(this));
    this.telegram.onCommand('imt', this.handleCheck.bind(this));
  }

  private async handleCheck(command: Command) {
    const msg = present(validate(command.args));
    await this.telegram.sendMessage(command.chatId, msg, command.messageId);
  }
}

export type CheckParams = {
  weight: Kg;
  userInfo: UserInfo;
};

export function validate(args: string[]): CheckParams | null {
  if (args.length !== 3) return null;

  const [genderStr, heightStr, weightStr] = args;
  const gender = validateGender(genderStr);
  const height = validateHeight(heightStr);
  const weight = validateWeight(parseNumber(weightStr));
  if (gender == null || height == null || weight == null) return null;

  return { weight, userInfo: { gender, height } };
}

export function present(params: CheckParams | null): string {
  if (params === null) {
    return `
Укажи данные командой: /check пол рост вес, где:
• пол — м или ж
• рост в см
• вес в кг

Пример: /check ж 164 45
Альтернатива: /bmi или /imt`.trim();
  }

  const gender = params.userInfo.gender === 'male' ? 'Мужчина' : 'Женщина';
  const bmi = bmiPresenter(Result.ok(calcBMIResult(params.weight, params.userInfo)));

  return `
${gender}, ${params.userInfo.height} см, ${params.weight} кг.

${bmi}
`.trim();
}
