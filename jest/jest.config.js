require('jest-preset-angular/ngcc-jest-processor');

const { myndExtendJestConfig } = require('@myndmanagement/test');

module.exports = myndExtendJestConfig({
  rootDir: `${__dirname}/../`,
  testRunner: 'jest-jasmine2',
  setupFilesAfterEnv: [
    '<rootDir>/jest/jest.setup.ts',
  ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  haste: {
    forceNodeFilesystemAPI: true,
  },
  coverageThreshold: {
    global: {
      statements: 20,
    }
  },
});
