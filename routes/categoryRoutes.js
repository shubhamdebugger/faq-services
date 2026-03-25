import express from "express";
import { getCategories, createCategory } from "../controllers/categoryController.js";
import { authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/v1/categories", getCategories);
router.post("/v1/create-category", authorize("admin"), createCategory);

export default router;
