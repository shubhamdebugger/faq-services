import express from "express";
import { createFaqLog, getUserFaqs } from "../controllers/faqLogsController.js";
import { authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/user-faq", authorize("admin"), getUserFaqs);
router.post("/create-faqlog", authorize("user"), createFaqLog);

export default router;
