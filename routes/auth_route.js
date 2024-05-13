const express = require("express");
const app = express();

const authMiddleware = require("../middlewares/auth_middleware");
const authController = require("../controllers/auth_controller");
const {validateRegister, validateLogin} = require("../helpers/auth_validator");

app.post("/register", validateRegister, authController.register);
app.post("/login", validateLogin, authController.login);
app.get("/profile", authMiddleware.vervifyToken, authController.getProfile);

module.exports = app; // Export app for other modules to use
