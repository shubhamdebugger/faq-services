import express from "express";
import {
    createCategoryOrSearch,
    getCategoryOrSearch
} from "../controllers/categoryController.js";
import { authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/v1/categories", getCategoryOrSearch);
router.post("/v1/create-category", createCategoryOrSearch);

export default router;
