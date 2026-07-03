import { jest } from "@jest/globals";

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret";
process.env.JWT_EXPIRES_IN = "1d";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
process.env.REFRESH_TOKEN_EXPIRES_IN = "7d";
process.env.MONGODB_URI = "mongodb://localhost:27017/medisync_test";
process.env.GEMINI_API_KEY = "test-gemini-key";

// Silence logger during tests
jest.unstable_mockModule("../src/services/logger.service.js", () => ({
  default: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
  },
  stream: {
    write: jest.fn(),
  },
}));
