/* tslint:disable:no-submodule-imports */
import { assert } from 'chai';
import sinon from 'sinon';
import { Command, handleCommand, parseCommand } from 'src/shared/infrastructure/TelegramGateway';
import { toTimestamp } from 'src/shared/utils/utils';
import { TelegrafContext } from 'telegraf/typings/context';
import * as TT from 'telegram-typings';

describe('handleCommand()', () => {
  it('should not call handler() if where is no command', async () => {
    const handler = sinon.fake();
    const next = sinon.fake();

    await handleCommand(handler, (null as unknown) as TelegrafContext);
    await handleCommand(handler, ({ message: null } as unknown) as TelegrafContext);
    await handleCommand(handler, ({ message: { text: null } } as unknown) as TelegrafContext);
    await handleCommand(handler, (null as unknown) as TelegrafContext, next);

    sinon.assert.notCalled(handler);
    sinon.assert.calledOnce(next);
  });

  it('should call handler()', async () => {
    const handler = sinon.fake().named('handler');
    const next = sinon.fake().named('next');
    const date = new Date('2019-08-29');
    const sendChatAction = sinon.fake.resolves(true).named('sendChatAction');
    const ctx = ({ message: createMsg(date, '/hi'), telegram: { sendChatAction } } as unknown) as TelegrafContext;

    await handleCommand(handler, ctx, next);

    sinon.assert.calledOnce(handler);
    const command: Command = {
      fullText: '/hi',
      command: 'hi',
      bot: undefined,
      argsText: '',
      args: [],
      messageId: 1,
      date,
      chatId: -1,
      from: ({} as unknown) as TT.User,
    };
    sinon.assert.calledWith(handler, command);
    sinon.assert.calledOnce(next);
    sinon.assert.calledOnce(sendChatAction);
  });
});

describe('parseCommand()', () => {
  it('should return null if not a command', () => {
    assert.isNull(parseCommand(({} as unknown) as TT.Message));
    assert.isNull(parseCommand(({ text: null } as unknown) as TT.Message));
    assert.isNull(parseCommand(({ text: '', from: {} } as unknown) as TT.Message));
    assert.isNull(parseCommand(({ text: 'text', from: {} } as unknown) as TT.Message));
    assert.isNull(parseCommand(({ text: 'text', forward_date: 1567018331, from: {} } as unknown) as TT.Message));
  });

  it('should parse command', () => {
    const date = new Date('2019-08-29');
    const from = ({} as unknown) as TT.User;

    assert.deepEqual(parseCommand(createMsg(date, '/hey')), {
      fullText: '/hey',
      command: 'hey',
      bot: undefined,
      argsText: '',
      args: [],
      messageId: 1,
      date,
      chatId: -1,
      from,
    });
    assert.deepEqual(parseCommand(createMsg(date, '/hey privet    bot, eto ya ')), {
      fullText: '/hey privet    bot, eto ya ',
      command: 'hey',
      bot: undefined,
      argsText: 'privet    bot, eto ya',
      args: ['privet', 'bot,', 'eto', 'ya'],
      messageId: 1,
      date,
      chatId: -1,
      from,
    });
    assert.deepEqual(parseCommand(createMsg(date, '/hey@fatmotorbot')), {
      fullText: '/hey@fatmotorbot',
      command: 'hey',
      bot: 'fatmotorbot',
      argsText: '',
      args: [],
      messageId: 1,
      date,
      chatId: -1,
      from,
    });
    assert.deepEqual(parseCommand(createMsg(date, '/hey@fatmotorbot  хаха')), {
      fullText: '/hey@fatmotorbot  хаха',
      command: 'hey',
      bot: 'fatmotorbot',
      argsText: 'хаха',
      args: ['хаха'],
      messageId: 1,
      date,
      chatId: -1,
      from,
    });
  });
});

function createMsg(date: Date, text?: string, chatId = -1): TT.Message {
  return ({ text, message_id: 1, from: {}, chat: { id: chatId }, date: toTimestamp(date) } as unknown) as TT.Message;
}
