// src/firebase/index.ts

export {
  // Auth
  getCurrentUser,
  getUserFromToken,
  verifyIdToken,
  sendResetPasswordEmail,
  verifyAndCreateUser,
  setCustomClaims,

  // User
  getUser,
  getUserByEmail,
  createUser,
  //deleteUser,
  updateUser,
  createUserDocument,
  getUsers,
  setUserRole,
  getUserRole,
  getUserProfile,
  updateUserProfile,
  deleteUserAsAdmin,
  // Activity
  logActivity,
  getUserActivityLogs,
  getAllActivityLogs,

  // Products
  getAllProducts,
  getFilteredProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getHeroSlidesFromFirestore,
  getRelatedProducts,
  likeProduct,
  unlikeProduct,
  getUserLikedProducts,

  // orders
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus
} from "./actions";
