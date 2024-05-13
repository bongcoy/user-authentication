const User = require("../models/user");
const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    console.log("register");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }
    console.log("register2");
    const {name, email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
      console.log("register3");
      return res
        .status(400)
        .json({success: false, msg: "Email already exists"});
    }
    console.log("register4");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({name, email, password: hashedPassword});
    const userData = await newUser.save();
    return res
      .status(201)
      .json({success: true, msg: "User created successfully", data: userData});
  } catch (error) {
    res.status(400).send(error);
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
    return res.status(200).json({
      success: true,
      msg: "Login successful",
      accessToken: token,
      tokenType: "Bearer",
      data: user,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const generateToken = (user) => {
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
