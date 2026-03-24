import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    let { category_name } = req.body;

    // Validation
    if (!category_name || !category_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    category_name = category_name.trim().toLowerCase();

    // Check for duplicate
    const existingCategory = await Category.findOne({
      category: category_name,
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Create category
    const storedCategory = await Category.create({
      category: category_name,
    });

    // Response
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: storedCategory,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};
