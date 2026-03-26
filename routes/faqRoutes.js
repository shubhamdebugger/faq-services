import express from "express";
import {
  getFaqs,
  createFaq,
  getFaqsPerUSer,
  updateFaq,
} from "../controllers/faqController.js";
import { authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();
router.put("/v1/faq/update-faqstatus/:faqId", authorize("admin"), updateFaq);
router.get("/v1/faq/get-faqs", getFaqs);
router.post(
  "/v1/faq/create-faq",
  authorize("admin"),
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createFaq,
);
router.get("/v1/faq/get-faqs-per-user", authorize("user"), getFaqsPerUSer);

export default router;
