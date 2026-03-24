import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../config/s3.js";
import Faq from "../models/Faq.js";

// 🔹 Create FAQ (upload video + save data)
export const createFaq = async (req, res) => {
  try {
    const { title, status, tags, category } = req.body;

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Video file is required" });
    }

    // 🔥 Upload to S3
    const key = `videos/${Date.now()}-${file.originalname}`;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    const videoUrl = `https://${params.Bucket}.s3.amazonaws.com/${key}`;

    // 🔥 Save to DB
    const faq = await Faq.create({
      title,
      status,
      tags,
      category: Array.isArray(category) ? category : [category],
      video_url: videoUrl,
    });

    res.status(201).json({
      message: "FAQ created successfully",
      data: faq,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔹 Get all FAQs
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