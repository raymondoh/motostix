/**
 * Firebase Authentication related types
 */

import type { UserRole } from "@/types/user";

export type DecodedIdToken = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
};

export type VerifyAndCreateUserResult = {
  success: boolean;
  uid?: string;
  error?: string;
};

export type GetUserFromTokenResult = {
  success: boolean;
  user?: DecodedIdToken;
  error?: string;
};

export type SendResetPasswordEmailResult = {
  success: boolean;
  error?: string;
};

/**
 * @deprecated This type appears to be unused. If you're using it, please remove this comment.
 */
export type VerifyPasswordResetCodeResult = {
  success: boolean;
  email?: string;
  error?: string;
};

/**
 * @deprecated This type appears to be unused. If you're using it, please remove this comment.
 */
export type ConfirmPasswordResetResult = {
  success: boolean;
  error?: string;
};

export type SetCustomClaimsResult = {
  success: boolean;
  error?: unknown; // safer than `any`
};

export type CustomClaims = {
  role?: UserRole;
  [key: string]: unknown; // Allow other flexible claims
};
