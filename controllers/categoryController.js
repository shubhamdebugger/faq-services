import Category from "../models/Category.js";
import CategoryUniqueSearch from "../models/CategoryUniqueSearch.js";

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

export const createUniqueSearchCategory = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    if (!searchTerm) {
      return res
        .status(400)
        .json({ data: null, message: "search field missing", success: false });
    }

    const normalizedSearch = searchTerm.toLowerCase().trim();

    // find category
    const categoryExists = await Category.findOne({
      category: normalizedSearch,
    });

    // will check category already exist or not
    if (categoryExists) {
      return res.status(400).json({
        data: null,
        success: false,
        message: "this search already availble in category",
      });
    }

    // this will add the unique search if exist then it will increase count
    const newSerachAdded = await CategoryUniqueSearch.findOneAndUpdate(
      { search: normalizedSearch },
      { $inc: { count: 1 } },
      { upsert: true, new: true },
    );

    //response

    return res.status(200).json({
      data: newSerachAdded,
      success: true,
      message: "search adde successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json({ data: null, message: err.message, success: false });
  }
};

export const getUniqueSearchCategories = async (req, res) => {
  try {
    const getUniqueSearchCategories =
      await CategoryUniqueSearch.find().select("search count -_id");

    // if nothing found
    if (!getUniqueSearchCategories) {
      return res.status(400).json({
        data: null,
        success: false,
        message: "no unique search for category found",
      });
    }

    // if found then sent in response
    return res.status(200).json({
      data: getUniqueSearchCategories,
      success: true,
      message: "already UniqueSearchCategories found",
    });
  } catch (err) {
    return res.status(400).json({
      data: null,
      success: false,
      message: err.message,
    });
  }
};
