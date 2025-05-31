// __mocks__/next-auth.js

// The code expects to call NextAuth as a function: NextAuth(...)
// The result of that call is an object with handlers, auth, etc.
// So we mock the default export as a Jest function that returns the expected shape.
const mockAuth = jest.fn(() => ({
  handlers: { GET: jest.fn(), POST: jest.fn() },
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn()
}));

// For any other files that might do `import { auth } from 'next-auth'`,
// we can attach them as properties to the main mock function.
mockAuth.auth = jest.fn();
mockAuth.signIn = jest.fn();
mockAuth.signOut = jest.fn();

module.exports = mockAuth;
