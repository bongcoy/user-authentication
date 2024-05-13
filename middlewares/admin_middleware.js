const onlyAdminAccess = (req, res, next) => {
  try {
    // 1 is the role id for admin
    if (req.user.role != 1) {
      return res.status(403).json({success: false, msg: "Access denied"});
    }
    return next();
  } catch (error) {
    return res.status(500).json({success: false, error: error.message});
  }
};

module.exports = {onlyAdminAccess};
