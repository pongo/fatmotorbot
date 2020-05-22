import { assert } from 'chai';
import { SlonikError } from 'slonik';
import { presentGetInfo } from 'src/app/bot/InfoCommand/presenters/presentGetInfo';
import { presentSetInfo } from 'src/app/bot/InfoCommand/presenters/presentSetInfo';
import { DatabaseError, InvalidFormatError } from 'src/app/shared/errors';
import { cm } from 'src/app/shared/types';
import { Result } from 'src/shared/utils/result';

describe('infoPresenter', () => {
  describe('get()', () => {
    it('error', () => {
      assert.strictEqual(
        presentGetInfo(Result.err(new DatabaseError(new SlonikError('ops')))),
        'Что-то не так с базой данных. Вызывайте техподдержку!'
      );
    });

    it('no data', () => {
      assert.strictEqual(
        presentGetInfo(Result.ok({ case: 'get:no-user-info' as const })),
        `
Укажи свои данные командой: /info пол рост, где:
• пол — м или ж
• рост в см — 185

Пример: /info ж 164
`.trim()
      );
    });

    it('data', () => {
      assert.strictEqual(
        presentGetInfo(Result.ok({ case: 'get', data: { gender: 'female', height: cm(150) } })),
        `Женщина, 150 см`
      );
      assert.strictEqual(
        presentGetInfo(Result.ok({ case: 'get', data: { gender: 'male', height: cm(150) } })),
        `Мужчина, 150 см`
      );
    });
  });

  describe('set()', () => {
    it('invalid data', () => {
      assert.strictEqual(
        presentSetInfo(Result.err(new InvalidFormatError())),
        'Не могу разобрать твои каракули. Пиши точно как я указал'
      );
    });

    it('valid data', () => {
      assert.strictEqual(
        presentSetInfo(Result.ok({ case: 'set', data: { gender: 'female', height: cm(150) }, bmi: null })),
        `Сохранил твои данные: женщина, 150 см`
      );
    });

    it('database error', () => {
      assert.strictEqual(
        presentSetInfo(Result.err(new DatabaseError(new SlonikError()))),
        'Что-то не так с базой данных. Вызывайте техподдержку!'
      );
    });
  });
});
