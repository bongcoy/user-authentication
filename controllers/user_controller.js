const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const mongoose = require("mongoose");

const User = require("../models/user");
const Permission = require("../models/permission");
const UserPermission = require("../models/user_permission");
const {sendMail} = require("../helpers/mailer");

// Add User
const addUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }

    const {name, email} = req.body;

    const isUser = await User.findOne({email});
    if (isUser) {
      return res.status(400).json({success: false, msg: "User already exists"});
    }

    const stringGenerate = randomstring.generate(8);
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(stringGenerate, salt);

    if (req.body.role == 1) {
      return res
        .status(400)
        .json({success: false, msg: "You are not authorized to add this role"});
    }

    const user = new User({
      name,
      email,
      password,
      // if role is not provided, default role will be 0
      role: req.body.role ? req.body.role : 0,
    });

    const savedUser = await user.save();

    // add permission to user
    if (req.body.permissions != undefined && req.body.permissions.length > 0) {
      const permissionArray = [];

      const addPermission = req.body.permissions.map(async (permission) => {
        const permissionData = await Permission.findOne({_id: permission.id});
        if (permissionData) {
          permissionArray.push({
            permission_name: permissionData.permission_name,
            permission_value: permission.values,
          });
        }
      });

      await Promise.all(addPermission);

      const userPermission = new UserPermission({
        user_id: savedUser._id,
        permissions: permissionArray,
      });

      await userPermission.save();
    }

    console.log("Password: ", stringGenerate);

    const htmlContent = `<p>Hello ${savedUser.name},</p>
    <p>Your account has been created successfully.</p>
    <table> 
        <tr>
            <td>Name:</td>
            <td>${name}</td>
        </tr>
        <tr>
            <td>Email:</td>
            <td>${email}</td>
        </tr>
        <tr>
            <td>Password:</td>
            <td>${stringGenerate}</td>
        </tr>
    </table>
    <p>Now you can login to our app. Thank you for registering with us.</p>
    <p>Regards,</p>
    <p>Team</p>`;

    const sendResult = await sendMail(
      email,
      "User Registration",
      "User Registered",
      htmlContent,
    );

    if (sendResult instanceof Error) {
      return res
        .status(500)
        .json({success: false, msg: "Error sending email", error: sendResult});
    }

    return res
      .status(201)
      .json({success: true, msg: "User added successfully", data: savedUser});
  } catch (error) {
    return res.status(500).json({success: false, msg: "Server Error", error});
  }
};

const getUsers = async (req, res) => {
  try {
    // const users = await User.find();
    const users = await User.aggregate([
      {$match: {_id: {$ne: new mongoose.Types.ObjectId(req.user._id)}}},
      {
        $lookup: {
          from: "userpermissions",
          localField: "_id",
          foreignField: "user_id",
          as: "permissions",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          permissions: {
            $cond: {
              if: {$isArray: "$permissions"},
              then: {$arrayElemAt: ["$permissions", 0]},
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          permissions: {
            permissions: "$permissions.permissions",
          },
        },
      },
    ]);
    return res.status(200).json({success: true, data: users});
  } catch (error) {
    return res.status(500).json({success: false, msg: "Server Error", error});
  }
};

const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }

    const {id, name, email, role} = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({success: false, msg: "User not found"});
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        role,
      },
      {new: true},
    );

    return res.status(200).json({
      success: true,
      msg: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({success: false, msg: "Server Error", error});
  }
};

const deleteUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }

    const {id} = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({success: false, msg: "User not found"});
    }

    await User.findByIdAndDelete(id);

    return res
      .status(200)
      .json({success: true, msg: "User deleted successfully"});
  } catch (error) {
    return res.status(500).json({success: false, msg: "Server Error", error});
  }
};

module.exports = {addUser, getUsers, updateUser, deleteUser};
