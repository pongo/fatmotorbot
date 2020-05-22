import { assert } from 'chai';
import { CheckCommandController } from 'src/app/bot/CheckCommand/CheckCommandController';
import { parseCommand } from 'src/shared/infrastructure/TelegramGateway';
import { TelegramMock } from 'test/TelegramMock';

describe('command /check', () => {
  const telegram = new TelegramMock();
  const controller = new CheckCommandController(telegram);

  before(() => {
    controller.enable();
    assert.strictEqual(telegram.handlers.size, 3);
  });

  beforeEach(() => {
    telegram.reset();
  });

  it('/check without args should send help', async () => {
    await shouldSendHelp('/check');
    await shouldSendHelp('/imt');
    await shouldSendHelp('/bmi');
  });

  it('/check with wrong args should send help', async () => {
    await shouldSendHelp('/check 176 87.3');
    await shouldSendHelp('/check 176 0');
    await shouldSendHelp('/check 0 87.3');
    await shouldSendHelp('/check г 176 87.3');
  });

  it('/check with correct args should send bmi info', async () => {
    await shouldSend(
      '/check м 176 87.3',
      'Мужчина, 176 см, 87.3 кг.\n\nИМТ: 27.62 — у тебя избыточный вес. Тебе нужно сбросить 9 кг до здорового веса, который для тебя от 63.22 до 79 кг. А твой идеальный вес: 70 кг (66–74).'
    );

    await shouldSend(
      '/check ж 176 87.3',
      'Женщина, 176 см, 87.3 кг.\n\nИМТ: 27.62 — у тебя избыточный вес. Тебе нужно сбросить 12 кг до здорового веса, который для тебя от 60.06 до 75.83 кг. А твой идеальный вес: 66 кг (60–70).'
    );
  });

  async function shouldSend(userText: string, botAnswer: string) {
    await userSend(userText);
    assert.strictEqual(telegram.lastSendMessageText, botAnswer);
  }

  async function userSend(text: string) {
    const command = parseCommand(telegram.createMsg({ text }));
    assert(command != null);
    await controller.handleCheck(command);
  }

  async function shouldSendHelp(userText: string) {
    const help =
      'Укажи данные командой: /check пол рост вес, где:\n• пол — м или ж\n• рост в см\n• вес в кг\n\nПример: /check ж 164 45\nАльтернатива: /bmi или /imt';
    await shouldSend(userText, help);
  }
});
