const jwt = require("jsonwebtoken");
const User = require("../models/user");

const vervifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];
  if (!token) {
    return res.status(401).json({success: false, msg: "Access denied"});
  }
  try {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({success: false, msg: "User not found"});
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({success: false, msg: "Invalid token"});
  }
};

module.exports = {vervifyToken};
