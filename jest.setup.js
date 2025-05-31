import "@testing-library/jest-dom";

// Environment variables
process.env.FIREBASE_PROJECT_ID = "mock-project-id";
process.env.FIREBASE_CLIENT_EMAIL = "mock-client-email@example.com";
process.env.FIREBASE_PRIVATE_KEY = "mock-----BEGIN PRIVATE KEY-----\\nMOCK_KEY_CONTENT\\n-----END PRIVATE KEY-----\\n";
process.env.FIREBASE_STORAGE_BUCKET = "mock-default-bucket.appspot.com"; // Ensure this matches expected format if any
process.env.AUTH_SECRET = "mock-auth-secret-for-jest";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.FIREBASE_API_KEY = "mock-api-key";
process.env.FIREBASE_AUTH_DOMAIN = "mock-auth-domain.firebaseapp.com";
process.env.FIREBASE_MESSAGING_SENDER_ID = "mock-messaging-sender-id";
process.env.FIREBASE_APP_ID = "mock-app-id";
process.env.FIREBASE_MEASUREMENT_ID = "mock-measurement-id";

// --- Firebase Admin SDK Mocks ---

const mockFirebaseAdminAppInstance = {
  name: "[DEFAULT]"
  // Add other app properties/methods if your code tries to access them
};

jest.mock("firebase-admin/app", () => ({
  getApps: jest.fn(() => []),
  initializeApp: jest.fn((config, appName) => {
    mockFirebaseAdminAppInstance.name = appName || "[DEFAULT]";
    return mockFirebaseAdminAppInstance;
  }),
  cert: jest.fn().mockReturnValue({ type: "mocked-cert" })
}));

// Mock firebase-admin/auth
const mockFirebaseAuthService = {
  deleteUser: jest.fn().mockResolvedValue(undefined),
  updateUser: jest.fn().mockResolvedValue({}),
  verifyIdToken: jest.fn().mockResolvedValue({ uid: "mock-uid" }),
  getUser: jest.fn().mockResolvedValue({ uid: "mock-uid", email: "mock@example.com", customClaims: {} }),
  setCustomUserClaims: jest.fn().mockResolvedValue(undefined),
  createCustomToken: jest.fn().mockResolvedValue("mock-custom-token")
  // Add any other auth methods your actions might use
};
jest.mock("firebase-admin/auth", () => ({
  getAuth: jest.fn(() => mockFirebaseAuthService)
}));

// Mock firebase-admin/firestore
const mockServerTimestampFn = jest.fn(() => new Date("2024-01-01T00:00:00.000Z")); // Consistent mock date
const mockFirestoreTimestamp = {
  now: jest.fn(() => ({
    toDate: () => new Date("2024-01-01T00:00:00.000Z"), // Consistent mock date
    seconds: Math.floor(new Date("2024-01-01T00:00:00.000Z").getTime() / 1000),
    nanoseconds: 0
  })),
  fromDate: jest.fn(date => ({
    toDate: () => date,
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: (date.getTime() % 1000) * 1000000
  }))
};
const mockFirestoreFieldValue = {
  serverTimestamp: mockServerTimestampFn,
  arrayUnion: jest.fn((...args) => ({ _elements: args, _type: "FieldValue.arrayUnion" })),
  arrayRemove: jest.fn((...args) => ({ _elements: args, _type: "FieldValue.arrayRemove" })),
  increment: jest.fn(val => ({ _operand: val, _type: "FieldValue.increment" })),
  delete: jest.fn(() => ({ _type: "FieldValue.delete" }))
};

// Mock collection and document references
const mockDocRef = {
  set: jest.fn().mockResolvedValue(undefined),
  update: jest.fn().mockResolvedValue(undefined),
  get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ id: "mockDocId" }), id: "mockDocId" }),
  delete: jest.fn().mockResolvedValue(undefined)
};

const mockCollectionRef = {
  doc: jest.fn().mockReturnValue(mockDocRef),
  add: jest.fn().mockResolvedValue({ id: "mock-added-doc-id" }),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  startAfter: jest.fn().mockReturnThis(),
  get: jest.fn().mockResolvedValue({
    empty: false,
    docs: [{ id: "mockDocId", data: () => ({ id: "mockDocId" }), exists: true }],
    forEach: jest.fn(callback => {
      callback({ id: "mockDocId", data: () => ({ id: "mockDocId" }), exists: true });
    })
  })
};

const mockFirebaseFirestoreInstance = {
  collection: jest.fn().mockReturnValue(mockCollectionRef),
  doc: jest.fn().mockReturnValue(mockDocRef),
  batch: () => ({
    delete: jest.fn(),
    update: jest.fn(),
    set: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined)
  }),
  runTransaction: jest.fn(async updateFunction => {
    const mockTransaction = {
      get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ id: "mockDocId" }) }),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    return updateFunction(mockTransaction);
  }),
  FieldValue: mockFirestoreFieldValue, // Make FieldValue accessible via the instance
  Timestamp: mockFirestoreTimestamp // Make Timestamp accessible via the instance
};

jest.mock("firebase-admin/firestore", () => ({
  getFirestore: jest.fn(() => mockFirebaseFirestoreInstance),
  // Export FieldValue and Timestamp directly for direct imports like `import { FieldValue } from 'firebase-admin/firestore'`
  FieldValue: mockFirestoreFieldValue,
  Timestamp: mockFirestoreTimestamp
}));

// Mock firebase-admin/storage
const mockFirebaseStorageService = {
  bucket: jest.fn(bucketName => ({
    name: bucketName || process.env.FIREBASE_STORAGE_BUCKET,
    file: jest.fn(filePath => ({
      delete: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
      download: jest.fn().mockResolvedValue([Buffer.from("mock file content")]),
      getSignedUrl: jest.fn().mockResolvedValue(["http://mockurl.com/file"]) // Ensure it returns an array like the actual API
      // Add other file methods your actions might use
    }))
    // Add other bucket methods your actions might use
  }))
};
jest.mock("firebase-admin/storage", () => ({
  getStorage: jest.fn(() => mockFirebaseStorageService)
}));

// Mock Firebase Client SDK
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn()
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  GoogleAuthProvider: jest.fn()
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn()
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: props => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ""} />;
  }
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn()
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    entries: jest.fn(),
    forEach: jest.fn(),
    toString: jest.fn()
  }),
  usePathname: () => "/mock-path"
}));

// Mock activity logging functions
jest.mock("@/firebase/admin/activity", () => ({
  logActivity: jest.fn().mockResolvedValue({ success: true }),
  logServerEvent: jest.fn().mockResolvedValue(undefined)
}));

// Mock logger
jest.mock("@/utils/logger", () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));
