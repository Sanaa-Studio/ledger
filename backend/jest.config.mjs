import { createDefaultEsmPreset } from "ts-jest";

const tsJestPreset = createDefaultEsmPreset({
  tsconfig: "./tsconfig.test.json",
});

export default {
  ...tsJestPreset,

  testEnvironment: "node",

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
