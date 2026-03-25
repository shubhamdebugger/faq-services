import express from "express";
import {
  getCategories,
  createCategory,
  createUniqueSearchCategory,
  getUniqueSearchCategories,
} from "../controllers/categoryController.js";
import { authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/v1/categories", getCategories);
router.get(
  "/v1/get-unique-search-category",
  authorize("admin"),
  getUniqueSearchCategories,
);
router.post("/v1/create-category", authorize("admin"), createCategory);
router.post(
  "/v1/create-unique-search",
  authorize("user"),
  createUniqueSearchCategory,
);

export default router;
