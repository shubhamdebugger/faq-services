import fs from "fs";
import mongoose from "mongoose";
import User from "../models/User.js"
import Faq from "../models/Faq.js";
import Category from "../models/Category.js";
import { getVideoDurationInSeconds } from "get-video-duration";
import { uploadToS3 } from "../services/s3Service.js";

export const createFaq = async (req, res) => {
  try {
    let { title, tags, categoryId } = req.body;

    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    // Validate required fields
    if (!title || !tags || !categoryId || !videoFile || !thumbnailFile) {
      return res.status(400).json({
        message: "Title, tags, categoryId, video and thumbnail are required",
      });
    }

    // Validate category
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({ message: "Tags must be a non-empty array", });
    }

    tags = tags.map(tag => tag.trim().toLowerCase());
    const tempDir = "./temp";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // TEMP FILE for duration
    const tempPath = `${tempDir}/${Date.now()}-${videoFile.originalname}`;
    fs.writeFileSync(tempPath, videoFile.buffer);

    // Get video duration
    const duration = await getVideoDurationInSeconds(tempPath);

    // Upload video
    const videoUrl = await uploadToS3(videoFile);

    // Upload thumbnail
    const thumbnailUrl = await uploadToS3(thumbnailFile);

    // Cleanup
    fs.unlinkSync(tempPath);

    // Save to DB
    const faq = await Faq.create({
      title: title.trim(),
      tags,
      category: categoryId,
      videoUrl,
      thumbnailUrl,
      videoLength: duration,
    });

    res.status(201).json({ message: "FAQ created successfully", data: faq });

  } catch (error) {
    console.error("Create FAQ Error:", error);

    res.status(500).json({ message: "Internal server error", error: error.message, });
  }
};

// Get all FAQs
export const getFaqs = async (req, res) => {
  try {
    // Get all FAQs
    const faqs = await Faq.find().sort({ createdAt: -1 }).lean();

    // Get all users with faq progress
    const users = await User.find({}, { faq: 1 }).lean();

    // Map: faqId -> array of user data
    const faqUserMap = {};

    users.forEach((user) => {
      if (user.faq?.length) {
        user.faq.forEach((item) => {
          const faqId = item.faqId.toString();

          if (!faqUserMap[faqId]) {
            faqUserMap[faqId] = [];
          }

          faqUserMap[faqId].push({
            userId: user._id,
            duration: item.duration || 0,
            isWatched: item.isWatched || false,
            count: item.count || 0,
          });
        });
      }
    });

    // Merge into FAQs
    const result = faqs.map((faq) => {
      return {
        ...faq,
        users: faqUserMap[faq._id.toString()] || [],
      };
    });

    res.json({
      count: result.length,
      data: result,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFaqsPerUSer = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all FAQs
    const faqs = await Faq.find({ status: "active" }).sort({ createdAt: -1 }).lean();

    // Get user progress
    const user = await User.findById(userId).lean();

    const userFaqMap = {};

    // Convert user faq array → map for fast lookup
    if (user?.faq?.length) {
      user.faq.forEach((item) => {
        userFaqMap[item.faqId.toString()] = item;
      });
    }

    // Merge data
    const result = faqs.map((faq) => {
      const userData = userFaqMap[faq._id.toString()];

      return {
        ...faq,
        duration: userData?.duration || 0,
        isWatched: userData?.isWatched || false,
        count: userData?.count || 0,
      };
    });

    res.status(200).json({
      message: "FAQs fetched successfully",
      data: result,
    });

  } catch (error) {
    console.error("Get FAQ Error:", error);

    res.status(500).json({ message: "Internal server error", error: error.message, });
  }
};
