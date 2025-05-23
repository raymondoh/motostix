// // types/index.ts

// // Auth types
// export type {
//   // Common auth types

//   UserProfile,

//   // Login types
//   LoginState,

//   // Registration types
//   RegisterState,

//   // Password types
//   ForgotPasswordState,
//   ResetPasswordState,
//   UpdatePasswordState
// } from "./auth";

// // User types
// export type {
//   // Common user types
//   User,
//   UserRole,
//   //UserActionResponse,

//   // Profile types
//   ProfileUpdateState,

//   // Admin types
//   UserSearchState
//   //UserRoleUpdateState

//   // Firestore data
// } from "./user";

// // Data privacy types
// export type {
//   // Export types
//   ExportFormat,
//   ExportDataState,

//   // Deletion types
//   DeleteAccountState,
//   DeletionRequestStatus,
//   DeletionRequest,
//   ProcessDeletionsResult
// } from "./data-privacy";

// // Firebase types
// export type {
//   UserDocumentData,
//   DecodedIdToken,
//   VerifyAndCreateUserResult,
//   GetUserFromTokenResult,
//   SetCustomClaimsResult
// } from "./firebase";

// // Product types
// export type { Product } from "./product/product";
// export type { OrderData } from "./order/order";

// // Common types (once you've created the common folder)
// export type { ActionResponse } from "./common/response";

// src/types/index.ts

// Auth types
export * as Auth from "./auth"; //

// User types
export * as User from "./user"; //

// Data Privacy types
export * as DataPrivacy from "./data-privacy"; //

// Firebase types
export * as Firebase from "./firebase"; //

// Product types
export * as Product from "./product"; //

// Order types
export * as Order from "./order"; //

// Common types
export * as Common from "./common";

// New Exports:
//export * as Carousel from "./carousel";
export * as Category from "./category";
export * as Dashboard from "./dashboard";
export * as Ecommerce from "./ecommerce";
export * as Search from "./search";

// Note on next-auth:
// Types for next-auth module augmentation (from next-auth/index.d.ts)
// are typically picked up by TypeScript automatically and don't need to be
// re-exported here for direct namespaced import.
// If you have other custom types in a 'src/types/next-auth/' directory
// (not the .d.ts for module augmentation), you could export them:
// export * as NextAuthCustom from "./next-auth";
