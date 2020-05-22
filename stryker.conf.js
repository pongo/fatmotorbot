process.env.NODE_ENV = 'test';

/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  mutator: 'typescript',
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'mocha',
  transpilers: ['typescript'],
  testFramework: 'mocha',
  coverageAnalysis: 'perTest',
  tsconfigFile: 'tsconfig.json',
  mutate: [
    //'dist/src/**/*.js',
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/config.ts',
    '!src/main.ts',
    '!src/migrate.ts',
  ],
  files: [
    //'dist/**/*.*',
    '*',
    '{src,test}/**/*.ts',
  ],
  mochaOptions: {
    spec: ['dist/test/nodb/**/*.test.js'],
    extension: ['js'],
    require: [],
  },
};
