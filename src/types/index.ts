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
