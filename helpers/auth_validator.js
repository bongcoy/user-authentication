const {check} = require("express-validator");

// Auth Validator
exports.validateRegister = [
  check("name")
    .isLength({min: 3})
    .withMessage("Name must be at least 3 characters long"),
  check("email").isEmail().withMessage("Email must be a valid email address"),
  check("password")
    .isLength({min: 6})
    .withMessage("Password must be at least 6 characters long"),
];
exports.validateLogin = [
  check("email").isEmail().withMessage("Email must be a valid email address"),
  check("password")
    .isLength({min: 6})
    .withMessage("Password must be at least 6 characters long"),
];

// User Validator
exports.validateUserAdd = [
  check("name")
    .isLength({min: 3})
    .withMessage("Name must be at least 3 characters long"),
  check("email").isEmail().withMessage("Email must be a valid email address"),
];
exports.validateUserUpdate = [
  check("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
  check("name")
    .isLength({min: 3})
    .withMessage("Name must be at least 3 characters long"),
];
exports.validateUserDelete = [
  check("id").isMongoId().withMessage("ID must be a valid MongoDB ID"),
];
