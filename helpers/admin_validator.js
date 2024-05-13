const {check} = require("express-validator");

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
