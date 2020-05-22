import { assert } from 'chai';
import { initBot } from 'src/app/bot/bot';
import { InfoRepository } from 'src/app/core/repositories/InfoRepository';
import { WeightRepository } from 'src/app/core/repositories/WeightRepository';
import { parseCommand } from 'src/shared/infrastructure/TelegramGateway';
import { createTestDB, InfoDbApi, WeightDbApi } from 'test/db/createTestDB';
import { TelegramMock } from 'test/TelegramMock';

const db = createTestDB();
const weightDbApi = new WeightDbApi(db);
const infoDbApi = new InfoDbApi(db);

describe('new user', () => {
  const telegram = new TelegramMock();
  const infoRepository = new InfoRepository(db);
  const weightRepository = new WeightRepository(db);
  const { weightCommandController, infoCommandController } = initBot(telegram, infoRepository, weightRepository, '');

  before(async () => {
    await weightDbApi.createTable();
    await infoDbApi.createTable();

    assert.strictEqual(telegram.handlers.size, 6);
    assert.strictEqual(telegram.handlers.get('w')?.length, 1);
    assert.strictEqual(telegram.handlers.get('weight')?.length, 1);
    assert.strictEqual(telegram.handlers.get('info')?.length, 1);
    assert.strictEqual(telegram.handlers.get('check')?.length, 1);
    assert.strictEqual(telegram.handlers.get('bmi')?.length, 1);
    assert.strictEqual(telegram.handlers.get('imt')?.length, 1);
  });

  after(async () => {
    await weightDbApi.dropTable();
    await infoDbApi.dropTable();
  });

  beforeEach(async () => {
    telegram.reset();
    await weightDbApi.truncateTable();
    await infoDbApi.truncateTable();
  });

  it('starts with /weight', async () => {
    function setHour(hour: number) {
      const date = new Date();
      date.setHours(hour);
      return date;
    }
    const morning = setHour(10);
    const evening = setHour(20);

    // начальный ввод веса
    await shouldSend(
      '/weight',
      'Впервые у меня? Встань на весы и взвесься. Затем добавь вес командой, например:\n\n/weight 88.41',
      morning
    );
    await shouldSend('/weight 0', 'Какой-какой у тебя вес?', morning);
    await shouldSend(
      '/w 55,2',
      'Твой вес: 55.2 кг.\n\nПервый шаг сделан. Регулярно делай замеры, например, каждую пятницу утром.\n\nДля расчета ИМТ не хватает данных. Укажи их при помощи /info',
      morning
    );

    // указание своих данных
    await shouldSend(
      '/info',
      'Укажи свои данные командой: /info пол рост, где:\n• пол — м или ж\n• рост в см — 185\n\nПример: /info ж 164',
      morning
    );
    await shouldSend('/info г', 'Не могу разобрать твои каракули. Пиши точно как я указал');
    await shouldSend(
      '/info м 171',
      'Сохранил твои данные: мужчина, 171 см.\n\nИМТ: 18.77 — у тебя неопасный дефицит веса. Тебе нужно набрать 4 кг до здорового веса, который для тебя от 58.83 до 73.5 кг. А твой идеальный вес: 66 кг (63–68).',
      morning
    );
    await shouldSend('/info', 'Мужчина, 171 см', morning);

    // еще раз проверил вес
    await shouldSend(
      '/weight',
      'Твой вес: 55.2 кг.\n\nРегулярно делай замеры, например, каждую пятницу утром.\n\nИМТ: 18.77 — у тебя неопасный дефицит веса. Тебе нужно набрать 4 кг до здорового веса, который для тебя от 58.83 до 73.5 кг. А твой идеальный вес: 66 кг (63–68).',
      morning
    );

    // указал новый
    await shouldSend(
      '/weight 55.8',
      'Твой вес: 55.8 кг.\n\n• Сегодня ранее: 55.2 (+0.60)\n\nИМТ: 18.97 — у тебя неопасный дефицит веса. Тебе нужно набрать 4 кг до здорового веса, который для тебя от 58.83 до 73.5 кг. А твой идеальный вес: 66 кг (63–68).',
      evening
    );
  });

  it('starts with /info', async () => {
    await shouldSend('/info ж 165', 'Сохранил твои данные: женщина, 165 см.\n\nТеперь нужно взвеситься: /weight 50');

    await shouldSend(
      '/weight 54',
      'Твой вес: 54 кг.\n\nПервый шаг сделан. Регулярно делай замеры, например, каждую пятницу утром.\n\nИМТ: 20.07 — у тебя здоровый вес 💪. Твоя граница здорового веса: от 51.11 до 64.54 кг. А твой идеальный вес: 58 кг (54–62).'
    );

    await shouldSend('/info', 'Женщина, 165 см');
  });

  async function shouldSend(userText: string, botAnswer: string, date: Date = new Date()) {
    await userSend(userText, date);
    assert.strictEqual(telegram.lastSendMessageText, botAnswer, userText);
  }

  async function userSend(text: string, date = new Date()) {
    const command = parseCommand(telegram.createMsg({ text, date }));
    assert(command != null);

    switch (text.split(' ')[0]) {
      case '/w':
      case '/weight':
        return weightCommandController.handleWeight(command);
      case '/info':
        return infoCommandController.handleInfo(command);
      default:
        throw Error(`Not found command: "${text}"`);
    }
  }
});
