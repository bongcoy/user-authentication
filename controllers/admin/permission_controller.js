const {validationResult} = require("express-validator");

const Permission = require("../../models/permission");

const addPermission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({succcess: false, msg: "Errors", errors: errors.array()});
    }
    const {permission_name} = req.body;

    const isExist = await Permission.findOne({permission_name});

    if (isExist) {
      return res
        .status(400)
        .json({success: false, msg: "Permission already exists"});
    }

    var obj = {
      permission_name,
    };

    if (req.body.default) {
      obj.is_default = req.body.default;
    }

    const permission = new Permission(obj);
    const newPermission = await permission.save();

    return res.status(200).json({
      success: true,
      msg: "Permission added successfully",
      data: newPermission,
    });
  } catch (error) {
    return res.status(500).json({succcess: false, error: error.message});
  }
};

const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    return res.status(200).json({success: true, data: permissions});
  } catch (error) {
    return res.status(500).json({success: false, error: error.message});
  }
};

const updatePermission = async (req, res) => {
  try {
    const {permission_id, permission_name} = req.body;

    const permission = await Permission.findById(permission_id);

    if (!permission) {
      return res
        .status(404)
        .json({success: false, msg: "Permission ID not found"});
    }

    const isPermissionNameExist = await Permission.findOne({
      _id: {$ne: permission_id},
      permission_name,
    });

    if (isPermissionNameExist) {
      return res
        .status(400)
        .json({success: false, msg: "Permission name already exists"});
    }

    var obj = {
      permission_name,
    };

    if (req.body.default != null) {
      obj.is_default = req.body.default;
    }

    const updatedPermission = await Permission.findByIdAndUpdate(
      permission_id,
      {$set: obj},
      {new: true},
    );

    return res.status(200).json({
      success: true,
      msg: "Permission updated successfully",
      data: updatedPermission,
    });
  } catch (error) {
    return res.status(500).json({success: false, error: error.message});
  }
};

const deletePermission = async (req, res) => {
  try {
    const {permission_id} = req.body;

    const permission = await Permission.findById(permission_id);

    if (!permission) {
      return res
        .status(404)
        .json({success: false, msg: "Permission ID not found"});
    }

    await Permission.findByIdAndDelete(permission_id);

    return res
      .status(200)
      .json({success: true, msg: "Permission deleted successfully"});
  } catch (error) {
    return res.status(500).json({success: false, error: error.message});
  }
};

module.exports = {
  addPermission,
  getPermissions,
  deletePermission,
  updatePermission,
};
