module.exports = {
  bail: true,
  exit: true,
  extension: ["ts"],
  spec: "test/**/*.test.ts",
  require: ["ts-node/register/transpile-only", "tsconfig-paths/register"],
};
