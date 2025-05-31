// All jest.mock calls MUST be at the top of the file, before any imports.
jest.mock("@/auth", () => ({ signIn: jest.fn() }));
jest.mock("@/firebase/actions", () => ({ logActivity: jest.fn() }));
jest.mock("@/utils/logger", () => ({
  __esModule: true,
  logger: jest.fn(),
  logServerEvent: jest.fn().mockResolvedValue(undefined)
}));

import { signInWithFirebase } from "@/actions/auth/firebase-auth";
import { signIn } from "@/auth";

// --- Configurable Mocks ---
const mockVerifyIdToken = jest.fn();
jest.mock("@/firebase/admin/firebase-admin-init", () => ({
  adminAuth: jest.fn(() => ({
    verifyIdToken: mockVerifyIdToken
  }))
}));
const mockedSignIn = signIn as jest.Mock;

// --- Test Suite ---
describe("signInWithFirebase action", () => {
  const idToken = "mock-id-token";
  const uid = "mock-uid";

  beforeEach(() => {
    jest.clearAllMocks();
    // Default to a successful token verification
    mockVerifyIdToken.mockResolvedValue({ uid });
  });

  it("should return success when token verification and NextAuth sign-in succeed", async () => {
    // Arrange: Mock NextAuth signIn to succeed
    mockedSignIn.mockResolvedValue({}); // No error object means success

    // Act
    const result = await signInWithFirebase({ idToken });

    // Assert
    expect(result.success).toBe(true);
    expect(mockVerifyIdToken).toHaveBeenCalledWith(idToken);
    expect(mockedSignIn).toHaveBeenCalledWith("credentials", { idToken, redirect: false });
  });

  it("should return failure when NextAuth sign-in fails", async () => {
    // Arrange: Mock NextAuth signIn to fail
    const authError = "CredentialsSignin";
    mockedSignIn.mockResolvedValue({ error: authError });
    const { logActivity, logServerEvent } = require("@/firebase/actions");

    // Act
    const result = await signInWithFirebase({ idToken });

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe(authError);
    expect(logActivity).toHaveBeenCalledWith(expect.objectContaining({ status: "failed" }));
    expect(logServerEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "auth:firebase_credential_login_failed" })
    );
  });

  it("should return failure when token verification fails", async () => {
    // Arrange: Mock token verification to throw an error
    const verifyError = new Error("Invalid token");
    mockVerifyIdToken.mockRejectedValue(verifyError);

    // Act
    const result = await signInWithFirebase({ idToken });

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe(verifyError.message);
    expect(mockedSignIn).not.toHaveBeenCalled(); // NextAuth signIn should not be called
  });
});
