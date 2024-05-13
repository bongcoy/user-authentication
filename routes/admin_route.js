const express = require("express");
const app = express();

const adminMiddleware = require("../middlewares/admin_middleware");
const authMiddleware = require("../middlewares/auth_middleware");

const permissionController = require("../controllers/admin/permission_controller");
const {
  validatePermissionAdd,
  validatePermissionUpdate,
  validatePermissionDelete,
} = require("../helpers/admin_validator");

const roleController = require("../controllers/admin/role_controller");
const {
  validateRoleAdd,
  validateRoleUpdate,
  validateRoleDelete,
} = require("../helpers/admin_validator");

// Permission Routes
app.post(
  "/add-permission",
  authMiddleware.vervifyToken,
  adminMiddleware.onlyAdminAccess,
  validatePermissionAdd,
  permissionController.addPermission,
);
app.get(
  "/get-permissions",
  authMiddleware.vervifyToken,
  adminMiddleware.onlyAdminAccess,
  permissionController.getPermissions,
);
app.post(
  "/update-permission",
  authMiddleware.vervifyToken,
  adminMiddleware.onlyAdminAccess,
  validatePermissionUpdate,
  permissionController.updatePermission,
);
app.post(
  "/delete-permission",
  authMiddleware.vervifyToken,
  adminMiddleware.onlyAdminAccess,
  validatePermissionDelete,
  permissionController.deletePermission,
);

// Role Routes
app.post(
  "/add-role",
  authMiddleware.vervifyToken,
  adminMiddleware.onlyAdminAccess,
  validateRoleAdd,
  roleController.addRole,
);
app.get(
  "/get-roles",
  authMiddleware.vervifyToken,
  adminMiddleware.onlyAdminAccess,
  roleController.getRoles,
);
app.post(
  "/update-role",
  authMiddleware.vervifyToken,
  adminMiddleware.onlyAdminAccess,
  validateRoleUpdate,
  roleController.updateRole,
);
app.post(
  "/delete-role",
  authMiddleware.vervifyToken,
  adminMiddleware.onlyAdminAccess,
  validateRoleDelete,
  roleController.deleteRole,
);

module.exports = app; // Export app for other modules to use
