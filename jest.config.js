module.exports = {
    testEnvironment: 'node',
    setupFilesAfterEnv: ['./jest.setup.ts'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['lcov', 'text-summary'],
  };
  