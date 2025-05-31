// src/firebase/client/firebase-client-init.test.ts

// Step 1: Create our own mock functions first. This gives us a stable reference.
const mockInitializeApp = jest.fn();
const mockGetApps = jest.fn();
const mockGetAuth = jest.fn();
const mockGetFirestore = jest.fn();
const mockRecaptchaVerifier = jest.fn(); // We removed the tests, but the import might still be there

// Step 2: Tell Jest to use our functions when it mocks the modules.
jest.mock("firebase/app", () => ({
  initializeApp: mockInitializeApp,
  getApps: mockGetApps
}));

jest.mock("firebase/auth", () => ({
  getAuth: mockGetAuth,
  GoogleAuthProvider: jest.fn(),
  GithubAuthProvider: jest.fn()
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: mockGetFirestore
}));

// We no longer need to import from the firebase/* modules in the test file itself.

// Define mock return values
const mockApp = { name: "mockApp" };
const mockAuth = { name: "mockAuth" };
const mockFirestore = { name: "mockFirestore" };

describe("Firebase Client Initialization", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_FIREBASE_API_KEY: "test-api-key",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "test-auth-domain",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "test-project-id"
    };

    // Set default return values for our mock functions
    mockInitializeApp.mockReturnValue(mockApp);
    mockGetAuth.mockReturnValue(mockAuth);
    mockGetFirestore.mockReturnValue(mockFirestore);
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should initialize Firebase app if no apps exist", () => {
    // Arrange
    mockGetApps.mockReturnValue([]);
    // Act
    const initModule = require("./firebase-client-init");
    // Assert
    expect(mockGetApps).toHaveBeenCalledTimes(1);
    expect(mockInitializeApp).toHaveBeenCalledTimes(1);
    expect(mockInitializeApp).toHaveBeenCalledWith(
      expect.objectContaining({
        apiKey: "test-api-key"
      })
    );
    expect(initModule.app).toBe(mockApp);
    expect(mockGetAuth).toHaveBeenCalledWith(mockApp);
    expect(mockGetFirestore).toHaveBeenCalledWith(mockApp);
  });

  it("should get the existing Firebase app if it is already initialized", () => {
    // Arrange
    mockGetApps.mockReturnValue([mockApp]);
    // Act
    const initModule = require("./firebase-client-init");
    // Assert
    // Note: The check happens twice in the code: `getApps().length` and `getApps()[0]`
    expect(mockGetApps).toHaveBeenCalledTimes(2);
    expect(mockInitializeApp).not.toHaveBeenCalled();
    expect(initModule.app).toBe(mockApp);
    expect(mockGetAuth).toHaveBeenCalledWith(mockApp);
    expect(mockGetFirestore).toHaveBeenCalledWith(mockApp);
  });
});
