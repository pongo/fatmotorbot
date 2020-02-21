/* eslint sort-keys: "error" */

module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true,
  },
  extends: [
    "airbnb-base",
    "prettier",
    "prettier/@typescript-eslint",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  overrides: [
    {
      files: ["*.test.ts"],
      rules: {
        "@typescript-eslint/no-non-null-assertion": 0,
        "@typescript-eslint/require-await": 0,
        "@typescript-eslint/tslint/config": [
          "error",
          {
            lintFile: "./test/tslint.json",
          },
        ],
        "fatmotorbot/max-lines-per-function-ignore-nested": 0,
        "max-lines-per-function": 0,
        "max-nested-callbacks": 0,
        "no-unused-expressions": 0,
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    project: "./tsconfig.eslint.json",
    sourceType: "module",
    tsconfigRootDir: ".",
  },
  plugins: ["@typescript-eslint", "@typescript-eslint/tslint", "import", "eslint-plugin-fatmotorbot"],
  reportUnusedDisableDirectives: true,
  root: true,
  rules: {
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        accessibility: "no-public",
        overrides: {
          parameterProperties: "off",
        },
      },
    ],
    "@typescript-eslint/indent": 0,
    "@typescript-eslint/interface-name-prefix": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-parameter-properties": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-use-before-define": ["error", { classes: true, functions: false }],
    "@typescript-eslint/prefer-interface": 0,
    "@typescript-eslint/tslint/config": [
      "error",
      {
        lintFile: "./tslint.json",
      },
    ],
    "complexity": ["warn", 10], // suck: 5, default: 20
    "fatmotorbot/max-lines-per-function-ignore-nested": ["warn", 20],
    "func-names": 0,
    "import/extensions": 0,
    "import/no-extraneous-dependencies": ["error", { devDependencies: ["**/*.test.ts"] }],
    "import/no-unresolved": 0,
    "import/prefer-default-export": 0,
    "lines-between-class-members": 0,
    "max-classes-per-file": 0,
    "max-depth": ["warn", 3], // suck: 3, default: 4
    "max-lines": ["warn", 300], // suck: 200, angular: 400, default: 300
    "max-lines-per-function": ["warn", 50], // suck: 20, angular: 75, default: 50
    "max-nested-callbacks": ["warn", 2], // suck: 2, default: 10
    "max-params": ["warn", 3], // suck: 2, default: 3
    "no-await-in-loop": 0,
    "no-console": 0,
    "no-continue": 0,
    "no-empty-function": ["error", { allow: ["constructors"] }],
    "no-param-reassign": "error",
    "no-plusplus": 0,
    "no-restricted-syntax": 0,
    "no-underscore-dangle": 0,
    "no-useless-constructor": 0,
  },
  settings: {
    "import/core-modules": ["telegram-typings"]
  },
};
