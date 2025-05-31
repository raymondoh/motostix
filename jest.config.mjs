// jest.config.mjs
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./"
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  resetModules: true,
  // ADDING jwks-rsa and jose TO THE LIST OF PACKAGES TO TRANSFORM:
  transformIgnorePatterns: ["/node_modules/(?!(next-auth|@auth/firebase-adapter|jwks-rsa|jose))"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@auth/firebase-adapter$": "<rootDir>/__mocks__/@auth/firebase-adapter.js",
    "^next-auth/providers/google$": "<rootDir>/__mocks__/next-auth/providers/google.js",
    "^next-auth/providers/credentials$": "<rootDir>/__mocks__/next-auth/providers/credentials.js",
    "^next-auth/react$": "<rootDir>/__mocks__/next-auth/react.js",
    "^next-auth$": "<rootDir>/__mocks__/next-auth.js"
  }
};

export default createJestConfig(customJestConfig);
