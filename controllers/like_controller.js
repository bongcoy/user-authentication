const {validationResult} = require("express-validator");
const Like = require("../models/like");
const like = require("../models/like");

const likePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: false, msg: errors.array()});
    }
    const {post_id, user_id} = req.body;
    const isLiked = await Like.findOne({post_id, user_id});
    if (isLiked) {
      return res.status(400).json({success: false, msg: "Post already liked"});
    }
    const like = new Like({post_id, user_id});
    const likeData = await like.save();
    return res.status(200).json({
      success: true,
      msg: "Post liked successfully",
      data: likeData,
    });
  } catch (error) {
    res.status(400).send({success: false, msg: "Error", error});
  }
};

const likePostv2 = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: false, msg: errors.array()});
    }
    const {post_id} = req.body;
    const user_id = req.user.id;
    const isLiked = await Like.findOne({post_id, user_id});
    if (isLiked) {
      return res.status(400).json({success: false, msg: "Post already liked"});
    }
    const like = new Like({post_id, user_id});
    const likeData = await like.save();
    return res.status(200).json({
      success: true,
      msg: "Post liked successfully",
      data: likeData,
    });
  } catch (error) {
    res.status(400).send({success: false, msg: "Error", error});
  }
};

const unlikePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: false, msg: errors.array()});
    }
    const {post_id, user_id} = req.body;
    const isLiked = await Like.findOne({post_id, user_id});

    // If post is not liked
    if (!isLiked) {
      return res
        .status(400)
        .json({success: false, msg: "You have not liked this post yet"});
    }
    await Like.findOneAndDelete({post_id, user_id});

    return res.status(200).json({
      success: true,
      msg: "Post unliked successfully",
    });
  } catch (error) {
    res.status(400).send({success: false, msg: "Error", error});
  }
};

const countLikes = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success: false, msg: errors.array()});
    }
    const {post_id} = req.body;
    const isPost = await Like.findOne({post_id});
    if (!isPost) {
      return res.status(400).json({success: false, msg: "Post not found"});
    }
    const likeCount = await Like.countDocuments({post_id});
    return res.status(200).json({
      success: true,
      msg: "Like count fetched successfully",
      data: likeCount,
    });
  } catch (error) {
    res.status(400).send({success: false, msg: "Error", error});
  }
};

module.exports = {
  likePost,
  likePostv2,
  unlikePost,
  countLikes,
};
