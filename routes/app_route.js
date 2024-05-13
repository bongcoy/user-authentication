const express = require("express");
const app = express();

const authMiddleware = require("../middlewares/auth_middleware");
const {
  validateCategoryAdd,
  validateCategoryUpdate,
  validateCategoryDelete,
} = require("../helpers/admin_validator");

const categoryController = require("../controllers/category_controller");

// Category Routes
app.post(
  "/add-category",
  authMiddleware.vervifyToken,
  validateCategoryAdd,
  categoryController.addCategory,
);
app.get(
  "/get-categories",
  authMiddleware.vervifyToken,
  categoryController.getCategories,
);
app.post(
  "/update-category",
  authMiddleware.vervifyToken,
  validateCategoryUpdate,
  categoryController.updateCategory,
);
app.post(
  "/delete-category",
  authMiddleware.vervifyToken,
  validateCategoryDelete,
  categoryController.deleteCategory,
);

// Post Routes
app.post("/add-post", authMiddleware.vervifyToken, categoryController.addPost);
app.get("/get-posts", authMiddleware.vervifyToken, categoryController.getPosts);
app.post(
  "/update-post",
  authMiddleware.vervifyToken,
  categoryController.updatePost,
);
app.post(
  "/delete-post",
  authMiddleware.vervifyToken,
  categoryController.deletePost,
);

module.exports = app; // Export app for other modules to use