import { assert } from 'chai';
import { parseCommand } from 'src/shared/infrastructure/TelegramGateway';

describe('TelegramGateway', () => {});

describe('parseCommand', () => {
  it('should return null if not a command', () => {
    assert.isNull(parseCommand());
    assert.isNull(parseCommand(null));
    assert.isNull(parseCommand(''));
    assert.isNull(parseCommand('text'));
  });

  it('should parse command', () => {
    assert.deepEqual(parseCommand('/hey'), {
      fullText: '/hey',
      command: 'hey',
      bot: undefined,
      argsText: undefined,
      args: [],
    });
    assert.deepEqual(parseCommand('/hey privet    bot, eto ya '), {
      fullText: '/hey privet    bot, eto ya ',
      command: 'hey',
      bot: undefined,
      argsText: 'privet    bot, eto ya',
      args: ['privet', 'bot,', 'eto', 'ya'],
    });
    assert.deepEqual(parseCommand('/hey@fatmotorbot'), {
      fullText: '/hey@fatmotorbot',
      command: 'hey',
      bot: 'fatmotorbot',
      argsText: undefined,
      args: [],
    });
    assert.deepEqual(parseCommand('/hey@fatmotorbot  хаха'), {
      fullText: '/hey@fatmotorbot  хаха',
      command: 'hey',
      bot: 'fatmotorbot',
      argsText: 'хаха',
      args: ['хаха'],
    });
  });
});
