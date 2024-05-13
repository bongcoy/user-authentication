const {validationResult} = require("express-validator");

const Category = require("../models/category");

const addCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }
    const {category_name} = req.body;
    const category = await Category.findOne({name: category_name});
    if (category) {
      return res
        .status(400)
        .json({success: false, msg: "Category already exists"});
    }
    const newCategory = new Category({name: category_name});
    const categoryData = await newCategory.save();
    return res.status(201).json({
      success: true,
      msg: "Category created successfully",
      data: categoryData,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({success: true, data: categories});
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }
    const {category_id, category_name} = req.body;
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(400).json({success: false, msg: "Category not found"});
    }
    const isCategoryNameExist = await Category.findOne({
      _id: {$ne: category_id},
      name: category_name,
    });

    if (isCategoryNameExist) {
      return res
        .status(400)
        .json({success: false, msg: "Category name already exists"});
    }

    var obj = {
      category_name,
    };

    const updatedCategory = await Category.findByIdAndUpdate(
      category_id,
      {$set: obj},
      {new: true},
    );
    return res.status(200).json({
      success: true,
      msg: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({success: false, msg: "Errors", errors: errors.array()});
    }
    const {category_id} = req.body;
    const category = await Category.findById({_id: category_id});
    if (!category) {
      return res.status(400).json({success: false, msg: "Category not found"});
    }
    await Category.findByIdAndDelete(category_id);
    return res
      .status(200)
      .json({success: true, msg: "Category deleted successfully"});
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
