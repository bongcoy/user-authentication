const {check} = require("express-validator");

// Permission Validator
exports.validatePermissionAdd = [
  check("permission_name", "Permission name is required").notEmpty(),
];
exports.validatePermissionUpdate = [
  check("permission_id", "Permission id is required").notEmpty(),
  check("permission_name", "Permission name is required").notEmpty(),
];
exports.validatePermissionDelete = [
  check("permission_id", "Permission id is required").notEmpty(),
];

// Category Validator
exports.validateCategoryAdd = [
  check("category_name", "Category name is required").notEmpty(),
];
exports.validateCategoryUpdate = [
  check("category_id", "Category id is required").notEmpty(),
  check("category_name", "Category name is required").notEmpty(),
];
exports.validateCategoryDelete = [
  check("category_id", "Category id is required").notEmpty(),
];

// Post Validator
exports.validatePostAdd = [
  check("title", "Title is required").notEmpty(),
  check("description", "Description is required").notEmpty(),
];
exports.validatePostUpdate = [
  check("post_id", "Post id is required").notEmpty(),
  check("title", "Title is required").notEmpty(),
  check("description", "Description is required").notEmpty(),
];
exports.validatePostDelete = [
  check("post_id", "Post id is required").notEmpty(),
];

// Role Validator
exports.validateRoleAdd = [
  check("role_name", "Role name is required").notEmpty(),
  check("value", "Value is required").notEmpty(),
];
exports.validateRoleUpdate = [
  check("role_id", "Role id is required").notEmpty(),
  check("role_name", "Role name is required").notEmpty(),
  check("value", "Value is required").notEmpty(),
  check("permissions", "Permissions is required").notEmpty(),
];
exports.validateRoleDelete = [
  check("role_id", "Role id is required").notEmpty(),
];
