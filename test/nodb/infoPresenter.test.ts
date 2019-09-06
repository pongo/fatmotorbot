import { assert } from 'chai';
import { SlonikError } from 'slonik';
import { infoPresenter } from 'src/app/bot/InfoCommand/infoPresenter';
import { InvalidFormatError } from 'src/app/shared/errors';
import { cm } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

describe('infoPresenter()', () => {
  describe('get()', () => {
    it('error', () => {
      assert.equal(
        infoPresenter(Result.err(new SlonikError('oops'))),
        'Что-то не так с базой данных. Вызывайте техподдержку!',
      );
    });

    it('no data', () => {
      assert.equal(
        infoPresenter(Result.ok({ case: 'get:none' as const })),
        `
Укажи свои данные командой: /info <пол> <рост>, где:
<пол> — м или ж
<рост в см> — 185

Пример: /info ж 164
`.trim(),
      );
    });

    it('data', () => {
      assert.equal(
        infoPresenter(Result.ok({ case: 'get', data: { gender: 'female', height: cm(150) } })),
        `Женщина, 150 см`,
      );
      assert.equal(
        infoPresenter(Result.ok({ case: 'get', data: { gender: 'male', height: cm(150) } })),
        `Мужчина, 150 см`,
      );
    });
  });

  describe('set()', () => {
    it('invalid data', () => {
      assert.equal(
        infoPresenter(Result.err(new InvalidFormatError())),
        'Не могу разобрать твои каракули. Пиши точно как я указал',
      );
    });

    it('valid data', () => {
      assert.equal(
        infoPresenter(Result.ok({ case: 'set', data: { gender: 'female', height: cm(150) } })),
        `Сохранил твои данные: женщина, 150 см`,
      );
    });
  });
});
