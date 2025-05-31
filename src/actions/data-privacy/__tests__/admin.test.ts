// All jest.mock calls MUST be at the top of the file.
jest.mock("@/auth");
jest.mock("@/utils/logger", () => ({ __esModule: true, logger: jest.fn(), logServerEvent: jest.fn() }));
// Mock the action's dependency
jest.mock("@/actions/data-privacy/deletion", () => ({ processAccountDeletion: jest.fn() }));

import { processPendingDeletions } from "@/actions/data-privacy/admin";
import { auth } from "@/auth";
import { processAccountDeletion } from "@/actions/data-privacy/deletion";

const mockedAuth = auth as jest.Mock;
const mockProcessAccountDeletion = processAccountDeletion as jest.Mock;

const mockGet = jest.fn();
const mockUpdate = jest.fn();
const mockDoc = jest.fn(() => ({ update: mockUpdate }));
const mockWhere = jest.fn(() => ({ get: mockGet }));
const mockCollection = jest.fn(() => ({ where: mockWhere, doc: mockDoc }));
jest.mock("@/firebase/admin/firebase-admin-init", () => ({
  adminDb: jest.fn(() => ({ collection: mockCollection }))
}));

describe("processPendingDeletions action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuth.mockResolvedValue({ user: { id: "adminUserId", role: "admin" } });
  });

  it("should successfully process pending requests", async () => {
    const mockDocs = [
      { id: "request1", data: () => ({ userId: "user1" }) },
      { id: "request2", data: () => ({ userId: "user2" }) }
    ];
    mockGet.mockResolvedValue({ docs: mockDocs, empty: false });
    mockProcessAccountDeletion.mockResolvedValue(true); // Mock successful deletion

    const result = await processPendingDeletions();

    expect(result.success).toBe(true);
    expect(result.processed).toBe(2);
    expect(result.errors).toBe(0);
    expect(mockProcessAccountDeletion).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });

  it("should return the correct counts when some deletions fail", async () => {
    const mockDocs = [
      { id: "request1", data: () => ({ userId: "user1" }) },
      { id: "request2", data: () => ({ userId: "user2" }) }
    ];
    mockGet.mockResolvedValue({ docs: mockDocs, empty: false });
    // Make the first call succeed and the second fail
    mockProcessAccountDeletion.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    const result = await processPendingDeletions();

    expect(result.success).toBe(true);
    expect(result.processed).toBe(1);
    expect(result.errors).toBe(1);
  });

  it("should handle errors during Firestore query", async () => {
    const dbError = new Error("Firestore is down");
    mockGet.mockRejectedValue(dbError);

    const result = await processPendingDeletions();

    expect(result.success).toBe(false);
    expect(result.error).toBe(dbError.message);
  });
});
