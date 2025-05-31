// __mocks__/@auth/firebase-adapter.js

// The real adapter exports a FirestoreAdapter function.
// We mock that specific export with a jest.fn().
module.exports = {
  FirestoreAdapter: jest.fn()
};
