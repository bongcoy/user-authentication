const {check} = require("express-validator");

exports.validatePostLikeOrUnlike = [
  check("user_id")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ID"),
  check("post_id")
    .isMongoId()
    .withMessage("Post ID must be a valid MongoDB ID"),
];
exports.validatePostLikeOrUnlikev2 = [
  check("post_id")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ID"),
];
exports.validateLikeCount = [
  check("post_id")
    .isMongoId()
    .withMessage("Post ID must be a valid MongoDB ID"),
];
