/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  testRegex: ".*\\.test\\.ts$",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  maxWorkers: 1,
};
