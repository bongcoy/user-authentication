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

module.exports = app; // Export app for other modules to use
