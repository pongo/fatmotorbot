module.exports = function (wallaby) {
  process.env.NODE_ENV = 'test';
  return {
    trace: true,
    files: ['src/**/*.ts', 'test/utils.ts', 'repositoryMocks.ts', 'TelegramMocks.ts'],

    tests: ['test/nodb/**/*.test.ts'],

    testFramework: 'mocha',
    env: {
      type: 'node',
    },
  };
};
