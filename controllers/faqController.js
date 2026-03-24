import fs from "fs";
import mongoose from "mongoose";

import Faq from "../models/faqModel.js";
import Category from "../models/Category.js";
import { getVideoDuration } from "../services/videoService.js";
import { uploadToS3 } from "../services/s3Service.js";

export const createFaq = async (req, res) => {
  try {
    const { title, tags, categoryId } = req.body;
    const file = req.file;

    if (!title || !tags || !categoryId || !file) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // temp file
    const tempPath = `./temp/${Date.now()}-${file.originalname}`;
    fs.writeFileSync(tempPath, file.buffer);

    // use helper
    const duration = await getVideoDuration(tempPath);

    // use S3 service
    const videoUrl = await uploadToS3(file);

    fs.unlinkSync(tempPath);

    const faq = await Faq.create({
      title,
      tags,
      category: categoryId,
      video_url: videoUrl,
      videoLength: duration,
    });

    res.status(201).json({
      message: "FAQ created successfully",
      data: faq,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all FAQs
export const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
                                                    
    res.json({
      count: faqs.length,
      data: faqs,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};