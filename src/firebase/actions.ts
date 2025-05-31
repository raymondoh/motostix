//src/firebase/actions.ts
"use server";

import * as adminActivity from "./admin/activity";
import * as adminProducts from "./admin/products";
import * as adminUsers from "./admin/user";
import * as adminAuthFunctions from "./admin/auth";
import * as adminOrders from "./admin/orders";
import * as adminCategories from "./admin/categories";

//import * as adminStorage from "./admin/storage";

// ================= User CRUD =================

export async function createUser(...args: Parameters<typeof adminAuthFunctions.createUserInFirebase>) {
  return await adminAuthFunctions.createUserInFirebase(...args);
}

export async function getUsers(...args: Parameters<typeof adminUsers.getUsers>) {
  return await adminUsers.getUsers(...args);
}

// export async function deleteUser(...args: Parameters<typeof adminAuthFunctions.deleteUser>) {
//   return await adminAuthFunctions.deleteUser(...args);
// }
// Move this up under User CRUD
export async function deleteUserAsAdmin(...args: Parameters<typeof adminAuthFunctions.deleteUserAsAdmin>) {
  return await adminAuthFunctions.deleteUserAsAdmin(...args);
}

export async function getUser(...args: Parameters<typeof adminAuthFunctions.getUser>) {
  return await adminAuthFunctions.getUser(...args);
}

export async function updateUser(...args: Parameters<typeof adminAuthFunctions.updateUser>) {
  return await adminAuthFunctions.updateUser(...args);
}

export async function getUserByEmail(...args: Parameters<typeof adminAuthFunctions.getUserByEmail>) {
  return await adminAuthFunctions.getUserByEmail(...args);
}

export async function getUserFromToken(...args: Parameters<typeof adminAuthFunctions.getUserFromToken>) {
  return await adminAuthFunctions.getUserFromToken(...args);
}

export async function setCustomClaims(...args: Parameters<typeof adminAuthFunctions.setCustomClaims>) {
  return await adminAuthFunctions.setCustomClaims(...args);
}

export async function verifyIdToken(...args: Parameters<typeof adminAuthFunctions.verifyIdToken>) {
  return await adminAuthFunctions.verifyIdToken(...args);
}

// ================= User Profile & Role =================

export async function createUserDocument(...args: Parameters<typeof adminUsers.createUserDocument>) {
  return await adminUsers.createUserDocument(...args);
}

export async function getUserProfile(...args: Parameters<typeof adminUsers.getUserProfile>) {
  return await adminUsers.getUserProfile(...args);
}

export async function updateUserProfile(...args: Parameters<typeof adminUsers.updateUserProfile>) {
  return await adminUsers.updateUserProfile(...args);
}

export async function getUserRole(...args: Parameters<typeof adminUsers.getUserRole>) {
  return await adminUsers.getUserRole(...args);
}

export async function setUserRole(...args: Parameters<typeof adminUsers.setUserRole>) {
  return await adminUsers.setUserRole(...args);
}

// ================= User Authentication =================

export async function verifyAndCreateUser(...args: Parameters<typeof adminAuthFunctions.verifyAndCreateUser>) {
  return await adminAuthFunctions.verifyAndCreateUser(...args);
}

// ================= Current User =================
export async function getCurrentUser(...args: Parameters<typeof adminUsers.getCurrentUser>) {
  return await adminUsers.getCurrentUser(...args);
}

// ================= Activity Logs =================

export async function getAllActivityLogs(...args: Parameters<typeof adminActivity.getAllActivityLogs>) {
  return adminActivity.getAllActivityLogs(...args);
}

export async function getUserActivityLogs(...args: Parameters<typeof adminActivity.getUserActivityLogs>) {
  return adminActivity.getUserActivityLogs(...args);
}

export async function logActivity(...args: Parameters<typeof adminActivity.logActivity>) {
  return adminActivity.logActivity(...args);
}

// ================= Email =================

export async function sendResetPasswordEmail(...args: Parameters<typeof adminAuthFunctions.sendResetPasswordEmail>) {
  return await adminAuthFunctions.sendResetPasswordEmail(...args);
}

// ================= Product Management =================

export async function getAllProducts(...args: Parameters<typeof adminProducts.getAllProducts>) {
  return adminProducts.getAllProducts(...args);
}
export async function getFilteredProducts(...args: Parameters<typeof adminProducts.getFilteredProducts>) {
  return adminProducts.getFilteredProducts(...args);
}

export async function addProduct(...args: Parameters<typeof adminProducts.addProduct>) {
  return adminProducts.addProduct(...args);
}

export async function getProductById(...args: Parameters<typeof adminProducts.getProductById>) {
  return adminProducts.getProductById(...args);
}

export async function updateProduct(...args: Parameters<typeof adminProducts.updateProduct>) {
  return adminProducts.updateProduct(...args);
}

export async function deleteProduct(...args: Parameters<typeof adminProducts.deleteProduct>) {
  return adminProducts.deleteProduct(...args);
}

export async function getFeaturedProducts(...args: Parameters<typeof adminProducts.getFeaturedProducts>) {
  return adminProducts.getFeaturedProducts(...args);
}
export async function getRelatedProducts(...args: Parameters<typeof adminProducts.getRelatedProducts>) {
  return adminProducts.getRelatedProducts(...args);
}

// ================= Category Management =================
export async function getCategories(...args: Parameters<typeof adminCategories.getCategories>) {
  return adminCategories.getCategories(...args);
}

export async function getFeaturedCategories(...args: Parameters<typeof adminCategories.getFeaturedCategories>) {
  return adminCategories.getFeaturedCategories(...args);
}

export async function getSubcategories(...args: Parameters<typeof adminCategories.getSubcategories>) {
  return adminCategories.getSubcategories(...args);
}

export async function getDesignThemes(...args: Parameters<typeof adminCategories.getDesignThemes>) {
  return adminCategories.getDesignThemes(...args);
}

export async function getProductTypes(...args: Parameters<typeof adminCategories.getProductTypes>) {
  return adminCategories.getProductTypes(...args);
}

export async function getMaterials(...args: Parameters<typeof adminCategories.getMaterials>) {
  return adminCategories.getMaterials(...args);
}

export async function getPlacements(...args: Parameters<typeof adminCategories.getPlacements>) {
  return adminCategories.getPlacements(...args);
}

// ================= Product Likes =================
export async function likeProduct(...args: Parameters<typeof adminProducts.likeProduct>) {
  return adminProducts.likeProduct(...args);
}
export async function unlikeProduct(...args: Parameters<typeof adminProducts.unlikeProduct>) {
  return adminProducts.unlikeProduct(...args);
}
export async function getUserLikedProducts(...args: Parameters<typeof adminProducts.getUserLikedProducts>) {
  return adminProducts.getUserLikedProducts(...args);
}

// ================= Order Management =================
export async function createOrder(...args: Parameters<typeof adminOrders.createOrder>) {
  return adminOrders.createOrder(...args);
}
export async function getAllOrders(...args: Parameters<typeof adminOrders.getAllOrders>) {
  return adminOrders.getAllOrders(...args);
}

export async function updateOrderStatus(...args: Parameters<typeof adminOrders.updateOrderStatus>) {
  return adminOrders.updateOrderStatus(...args);
}
export async function getOrderById(...args: Parameters<typeof adminOrders.getOrderById>) {
  return adminOrders.getOrderById(...args);
}

export async function getUserOrders(...args: Parameters<typeof adminOrders.getUserOrders>) {
  return adminOrders.getUserOrders(...args);
}

// ================= Content Management =================
// export async function getHeroSlidesFromFirestore(...args: Parameters<typeof adminProducts.getHeroSlidesFromFirestore>) {
//   return adminProducts.getHeroSlidesFromFirestore(...args);
// }
