const {validationResult} = require("express-validator");

const Post = require("../models/post");

const addPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }
    const {title, description, category_id} = req.body;
    const post = new Post({title, description, category_id});
    const postData = await post.save();
    return res.status(201).json({
      success: true,
      msg: "Post created successfully",
      data: postData,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json({success: true, data: posts});
  } catch (error) {
    res.status(400).send(error);
  }
};

const updatePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }
    const {post_id, title, content, category_id} = req.body;
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(400).json({success: false, msg: "Post not found"});
    }
    const postData = await Post.findByIdAndUpdate(
      post_id,
      {title, content, category_id},
      {new: true},
    );
    return res.status(200).json({
      success: true,
      msg: "Post updated successfully",
      data: postData,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }
    const {post_id} = req.body;
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(400).json({success: false, msg: "Post not found"});
    }
    await Post.findByIdAndDelete(post_id);
    return res
      .status(200)
      .json({success: true, msg: "Post deleted successfully"});
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  addPost,
  getPosts,
  updatePost,
  deletePost,
};
