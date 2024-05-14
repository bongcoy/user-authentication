const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");

const User = require("../models/user");

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

    console.log("Password: ", stringGenerate);

    return res
      .status(201)
      .json({success: true, msg: "User added successfully", data: savedUser});
  } catch (error) {
    return res.status(500).json({success: false, msg: "Server Error", error});
  }
};

module.exports = {addUser};
