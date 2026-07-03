export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {},
  setupFilesAfterSetup: [],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/config/swagger.js",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};
