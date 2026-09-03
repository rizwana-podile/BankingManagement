module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json', 'html'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'backend/**/*.js',
    '!**/node_modules/**',
    '!**/data/**'
  ]
};