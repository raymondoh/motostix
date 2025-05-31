// __mocks__/@/firebase/actions.js

// This file mocks the functions exported from '@/firebase/actions'
// so that our server action tests don't actually try to write to the database.
// We provide a jest.fn() for each function that is imported by our action files.

module.exports = {
  logActivity: jest.fn(),
  addProductToDb: jest.fn(),
  deleteProductFromDb: jest.fn(),
  updateProductInDb: jest.fn(),
  getProductByIdFromDb: jest.fn(),
  getAllProductsFromDB: jest.fn(),
  likeProductInDb: jest.fn(),
  unlikeProductInDb: jest.fn(),
  getRelatedProductsFromDb: jest.fn(),
  getUserLikedProducts: jest.fn(),
  getUserOrders: jest.fn(),
  getAllOrders: jest.fn(),
  updateOrderStatus: jest.fn(),
  createOrder: jest.fn(),
  createUserInFirebase: jest.fn()
  // Add any other functions from this module as they are needed for tests
};
