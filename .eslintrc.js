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
  overrides: [
    {
      files: ["*.test.ts"],
      rules: {
        "@typescript-eslint/require-await": 0,
        "@typescript-eslint/tslint/config": [
          "error",
          {
            lintFile: "./test/tslint.json",
          },
        ],
        "max-lines-per-function": 0,
        "max-nested-callbacks": 0,
        "no-unused-expressions": 0,
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
    sourceType: "module",
    tsconfigRootDir: ".",
  },
  plugins: ["@typescript-eslint", "@typescript-eslint/tslint", "import"],
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
    "@typescript-eslint/no-use-before-define": ["error", { classes: true, functions: false }],
    "@typescript-eslint/prefer-interface": 0,
    "@typescript-eslint/tslint/config": [
      "error",
      {
        lintFile: "./tslint.json",
      },
    ],
    "complexity": ["error", 5],
    "func-names": 0,
    "import/no-extraneous-dependencies": ["error", { devDependencies: ["**/*.test.ts"] }],
    "import/no-unresolved": 0,
    "import/prefer-default-export": 0,
    "lines-between-class-members": 0,
    "max-classes-per-file": 0,
    "max-depth": ["error", 3],
    "max-lines": ["error", 200],
    "max-lines-per-function": ["error", 20],
    "max-nested-callbacks": ["error", 2],
    "max-params": ["error", 3],
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
};
