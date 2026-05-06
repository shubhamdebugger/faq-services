import Category from "../models/Category.js";

export const createCategoryOrSearch = async (req, res) => {
  try {
    let { value, type } = req.body;

    if (!value || !value.trim()) {
      return res.status(400).json({
        success: false,
        message: "Value is required",
      });
    }

    if (!type || !["category", "search"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be 'category' or 'search'",
      });
    }

    const normalized = value.trim().toLowerCase();

    // CATEGORY CASE
    if (type === "category") {
      const exists = await Category.findOne({
        value: normalized,
        type: "category",
      });

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
        });
      }

      const newCategory = await Category.create({
        value: normalized,
        type: "category",
      });

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: newCategory,
      });
    }

    // SEARCH CASE
    const searchData = await Category.findOneAndUpdate(
      { value: normalized, type: "search" },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Search tracked successfully",
      data: searchData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getCategoryOrSearch = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type || !["category", "search"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required or wrong field type provided",
      });
    }

    const data = await Category.find({ type })
      .select("value count type -_id")
      .lean();

    return res.status(200).json({
      success: true,
      message: `${type} fetched successfully`,
      data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
