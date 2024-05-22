const User = require("../models/user");
const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Permission = require("../models/permission");
const UserPermission = require("../models/userPermission");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }

    const {name, email, password} = req.body;
    const user = await User.findOne({email});

    if (user) {
      return res
        .status(400)
        .json({success: false, msg: "Email already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({name, email, password: hashedPassword});
    const userData = await newUser.save();

    // Add user default permission
    const defaultPermissions = await Permission.find({is_default: true});

    if (defaultPermissions.length > 0) {
      const permissions = [];
      defaultPermissions.forEach(async (permission) => {
        permissions.push({
          permission_name: permission.permission_name,
          permission_value: [0, 1, 2, 3],
        });
        console.log("permissions", permissions);
      });
      const userPermission = new UserPermission({
        user_id: userData._id,
        permissions,
      });
      await userPermission.save();
    }

    return res
      .status(201)
      .json({success: true, msg: "User created successfully", data: userData});
  } catch (error) {
    res.status(400).send({success: false, msg: "Error", error});
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({success: false, msg: "Invalid email"});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({success: false, msg: "Invalid password"});
    }
    const token = await generateToken(user);

    // get user data with all permissions
    const result = await User.aggregate([
      {$match: {_id: user._id}},
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
            permission: "$permissions.permissions",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      msg: "Login successful",
      accessToken: token,
      tokenType: "Bearer",
      data: result,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const generateToken = async (user) => {
  return jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "2h"});
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({success: true, data: user});
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = {register, login, getProfile};
