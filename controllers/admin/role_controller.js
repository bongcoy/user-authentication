const {validationResult} = require("express-validator");

const Role = require("../../models/role");

const addRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }
    const {role_name, value, permissions} = req.body;

    const isExist = await Role.findOne({role_name});

    if (isExist) {
      return res.status(400).json({success: false, msg: "Role already exists"});
    }

    var obj = {
      role_name,
      value,
      permissions,
    };

    const role = new Role(obj);
    const newRole = await role.save();

    return res.status(200).json({
      success: true,
      msg: "Role added successfully",
      data: newRole,
    });
  } catch (error) {
    return res.status(500).json({success: false, error: error.message});
  }
};

const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    return res.status(200).json({success: true, data: roles});
  } catch (error) {
    return res.status(500).json({success: false, error: error.message});
  }
};

const updateRole = async (req, res) => {
  try {
    const {role_id, role_name, value, permissions} = req.body;

    const role = await Role.findById(role_id);

    if (!role) {
      return res.status(400).json({success: false, msg: "Role not found"});
    }

    var obj = {role_name, value, permissions};
    const roleData = await Role.findByIdAndUpdate(
      role_id,
      {$set: obj},
      {new: true},
    );
    return res.status(200).json({
      success: true,
      msg: "Role updated successfully",
      data: roleData,
    });
  } catch (error) {
    return res.status(500).json({success: false, error: error.message});
  }
};

const deleteRole = async (req, res) => {
  try {
    const {role_id} = req.body;
    const role = await Role.findById(role_id);
    if (!role) {
      return res.status(400).json({success: false, msg: "Role not found"});
    }
    await Role.findByIdAndDelete(role_id);
    return res
      .status(200)
      .json({success: true, msg: "Role deleted successfully"});
  } catch (error) {
    return res.status(500).json({success: false, error: error.message});
  }
};

module.exports = {
  addRole,
  getRoles,
  updateRole,
  deleteRole,
};
