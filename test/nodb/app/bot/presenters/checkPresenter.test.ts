import { assert } from 'chai';
import { present } from 'src/app/bot/CheckCommand/checkPresenter';
import { checkUseCase } from 'src/app/core/useCases/checkUseCase';
import { InvalidFormatError } from 'src/app/shared/errors';
import { Result } from 'src/shared/utils/result';

describe('checkPresenter', () => {
  it('should return help on wrong args', () => {
    assert.strictEqual(
      present(Result.err(new InvalidFormatError())),
      `
Укажи данные командой: /check пол рост вес, где:
• пол — м или ж
• рост в см
• вес в кг

Пример: /check ж 164 45
Альтернатива: /bmi или /imt
`.trim()
    );
  });

  it('should return bmi text', () => {
    assert.strictEqual(
      present(checkUseCase(['м', '171', '57.8'])),
      `
Мужчина, 171 см, 57.8 кг.

ИМТ: 19.65 — у тебя неопасный дефицит веса. Тебе нужно набрать 2 кг до здорового веса, который для тебя от 58.83 до 73.5 кг. А твой идеальный вес: 66 кг (63–68).
`.trim()
    );

    assert.strictEqual(
      present(checkUseCase(['ж', '171', '57,8'])),
      `
Женщина, 171 см, 57.8 кг.

ИМТ: 19.65 — у тебя здоровый вес 💪. Твоя граница здорового веса: от 55.89 до 70.56 кг. А твой идеальный вес: 63 кг (57–66).
`.trim()
    );
  });
});
