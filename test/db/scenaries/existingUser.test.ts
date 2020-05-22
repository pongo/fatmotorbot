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

describe('existing user', () => {
  const telegram = new TelegramMock();
  const infoRepository = new InfoRepository(db);
  const weightRepository = new WeightRepository(db);
  const { weightCommandController, infoCommandController } = initBot(telegram, infoRepository, weightRepository, '');

  before(async () => {
    await weightDbApi.createTable();
    await infoDbApi.createTable();
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

  it('adds weight', async () => {
    const weekAgo = daysAgo(7);
    await userSend('/info м 171', weekAgo);
    await userSend('/w 55', weekAgo);

    await shouldSend(
      '/weight 56',
      'Твой вес: 56 кг.\n\n• Неделю назад: 55 (+1)\n\nИМТ: 19.04 — у тебя неопасный дефицит веса. Тебе нужно набрать 3 кг до здорового веса, который для тебя от 58.83 до 73.5 кг. А твой идеальный вес: 66 кг (63–68).'
    );
  });

  it('adds weight (without /info)', async () => {
    const weekAgo = daysAgo(7);
    await userSend('/w 55', weekAgo);

    await shouldSend(
      '/weight 56',
      'Твой вес: 56 кг.\n\n• Неделю назад: 55 (+1)\n\nДля расчета ИМТ не хватает данных. Укажи их при помощи /info'
    );
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

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}
