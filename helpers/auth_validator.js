const {check} = require("express-validator");

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
