// src/types/auth/index.ts

/**
 * Auth Types Index
 *
 * This file explicitly exports all auth-related types from the auth directory.
 * Using this index file makes imports clearer and helps with IDE auto-imports.
 */

// Common auth types
export type { AuthActionResponse, UserProfile } from "./common"; //

// Login types
export type { LoginState, LoginResponse } from "./login"; //

// Registration types
export type { RegisterState } from "./register"; //

// Password management types
// export type { ForgotPasswordState, ResetPasswordState, UpdatePasswordState } from "./password"; //
export type {
  ForgotPasswordState,
  ResetPasswordState,
  UpdatePasswordState,
  LogPasswordResetInput,
  GetUserIdByEmailInput,
  GetUserIdByEmailResponse,
  UpdatePasswordHashInput //here if needed via Auth. namespace
} from "./password";

// **** ADD THIS LINE: ****
export * from "./email-verification"; // This will export UpdateEmailVerificationInput, UpdateEmailVerificationResponse, etc.
export * from "./firebase-auth"; // This will export SignInWithFirebaseInput, SignInWithFirebaseResponse, etc.
// Or, if you prefer explicit re-exports:
// export type { UpdateEmailVerificationInput, UpdateEmailVerificationResponse } from "./email-verification";

// Re-export all types (alternative approach shown in your file)
// If you uncomment these, make sure "./email-verification" is also included:
// export * from "./common";
// export * from "./login";
// export * from "./register";
// export * from "./password";
// export * from "./email-verification"; // Add here too if using this style
