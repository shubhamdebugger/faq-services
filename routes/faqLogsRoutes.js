import express from "express";
import { createFaqLog, getUserFaqs } from "../controllers/faqLogsController.js";

const router = express.Router();
router.get("/user-faq", getUserFaqs);
router.post("/create-faqlog", createFaqLog);
export default router;
