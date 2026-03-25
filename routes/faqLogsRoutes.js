import express from "express";
import { createFaqLog, getUserFaqs } from "../controllers/faqLogsController.js";
import { authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/v1/user-faq/:userId", authorize("admin"), getUserFaqs);
router.post("/v1/create-faqlog", authorize("user"), createFaqLog);

export default router;
