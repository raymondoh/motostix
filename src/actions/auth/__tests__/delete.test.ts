// All jest.mock calls MUST be at the top of the file.
jest.mock("@/utils/logger", () => ({
  __esModule: true,
  logger: jest.fn(),
  logServerEvent: jest.fn().mockResolvedValue(undefined)
}));
jest.mock("@/firebase/admin/auth", () => ({ deleteUserImage: jest.fn() }));
jest.mock("@/firebase/actions", () => ({ logActivity: jest.fn() }));

import { deleteUserAsAdmin } from "@/actions/auth/delete";

const mockDeleteUser = jest.fn();
const mockUserDocGet = jest.fn();
const mockUserDocDelete = jest.fn();
const mockUserDocRef = { get: mockUserDocGet, delete: mockUserDocDelete };
const mockCollectionRef = { doc: jest.fn(() => mockUserDocRef) };
jest.mock("@/firebase/admin/firebase-admin-init", () => ({
  adminAuth: jest.fn(() => ({ deleteUser: mockDeleteUser })),
  adminDb: jest.fn(() => ({ collection: jest.fn(() => mockCollectionRef) }))
}));

describe("deleteUserAsAdmin action", () => {
  const adminId = "testAdminId";
  const userId = "testUserIdToDelete";

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserDocGet.mockResolvedValue({
      exists: true,
      data: () => ({ image: "path/to/image.jpg" })
    });
    mockDeleteUser.mockResolvedValue(undefined);
    mockUserDocDelete.mockResolvedValue(undefined);
    const { deleteUserImage } = require("@/firebase/admin/auth");
    deleteUserImage.mockResolvedValue({ success: true });
    const { logActivity } = require("@/firebase/actions");
    logActivity.mockResolvedValue({ success: true });
  });

  it("should successfully delete a user", async () => {
    const result = await deleteUserAsAdmin({ userId, adminId });
    expect(result.success).toBe(true);
  });
});
