// All jest.mock calls MUST be at the top of the file.
jest.mock("@/auth");
jest.mock("@/utils/logger", () => ({ logger: jest.fn(), logServerEvent: jest.fn() }));
jest.mock("@/schemas/auth", () => ({
  updatePasswordSchema: { safeParse: jest.fn() }
}));
jest.mock("bcryptjs", () => ({ compare: jest.fn() }));
jest.mock("@/utils/hashPassword", () => ({ hashPassword: jest.fn() }));
jest.mock("@/firebase/actions", () => ({ logActivity: jest.fn() }));

import { updatePassword } from "@/actions/auth/password";
import { auth } from "@/auth";

const mockedAuth = auth as jest.Mock;
const mockUpdateUser = jest.fn();
const mockUserDocGet = jest.fn();
const mockUserDocUpdate = jest.fn();
const mockUserDocRef = { get: mockUserDocGet, update: mockUserDocUpdate };
const mockCollectionRef = { doc: jest.fn(() => mockUserDocRef) };
jest.mock("@/firebase/admin/firebase-admin-init", () => ({
  adminAuth: jest.fn(() => ({ updateUser: mockUpdateUser })),
  adminDb: jest.fn(() => ({ collection: jest.fn(() => mockCollectionRef) }))
}));

describe("updatePassword action", () => {
  const userId = "testUserId";
  const passwordData = {
    currentPassword: "currentPassword123",
    newPassword: "newSecurePassword123",
    confirmPassword: "newSecurePassword123"
  };

  const createFormData = (data: Record<string, string>) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    return formData;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuth.mockResolvedValue({ user: { id: userId } });
    const { updatePasswordSchema } = require("@/schemas/auth");
    updatePasswordSchema.safeParse.mockReturnValue({ success: true, data: passwordData });
    mockUserDocGet.mockResolvedValue({
      exists: true,
      data: () => ({ passwordHash: "hashedCurrentPassword" })
    });
    const bcrypt = require("bcryptjs");
    bcrypt.compare.mockResolvedValue(true);
    const { hashPassword } = require("@/utils/hashPassword");
    hashPassword.mockResolvedValue("hashedNewPassword");
    mockUpdateUser.mockResolvedValue({});
    mockUserDocUpdate.mockResolvedValue(undefined);
  });

  it("should successfully update password", async () => {
    const formData = createFormData(passwordData);
    const result = await updatePassword({ success: false, error: null }, formData);
    expect(result.success).toBe(true);
    expect(result.message).toBe("Password updated successfully.");
  });
});
