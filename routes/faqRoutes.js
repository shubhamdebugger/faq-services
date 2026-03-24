import express from "express";
import { getFaqs, createFaq } from "../controllers/faqController.js";

const router = express.Router();
router.get("/faqs", getFaqs);
router.post("/faq", createFaq);
export default router;
