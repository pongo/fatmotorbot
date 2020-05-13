import { assert } from 'chai';
import { present, validate } from 'src/app/bot/CheckCommand/CheckCommandController';
import { cm, kg } from 'src/app/shared/types';

describe('validate()', () => {
  it('should validate args', () => {
    assert.deepEqual(validate(['м', '170', '55']), { weight: kg(55), userInfo: { gender: 'male', height: cm(170) } });
    assert.deepEqual(validate(['ж', '170', '55']), { weight: kg(55), userInfo: { gender: 'female', height: cm(170) } });

    assert.isNull(validate(['ж', '170']));
    assert.isNull(validate(['ж']));
    assert.isNull(validate([]));
  });
});

describe('present()', () => {
  it('should return help on wrong args', () => {
    assert.equal(
      present(null),
      `
Укажи данные командой: /check пол рост вес, где:
• пол — м или ж
• рост в см
• вес в кг

Пример: /check ж 164 45
Альтернатива: /bmi или /imt
`.trim(),
    );
  });

  it('should return bmi text', () => {
    assert.equal(
      present({ weight: kg(57.8), userInfo: { gender: 'male', height: cm(171) } }),
      `
Мужчина, 171 см, 57.8 кг.

ИМТ: 19.65 — у тебя неопасный дефицит веса. Тебе нужно набрать 2 кг до здорового веса, который для тебя от 58.83 до 73.5 кг. А твой идеальный вес: 66 кг (63–68).
`.trim(),
    );
  });
});
