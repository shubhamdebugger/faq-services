import { Router } from "express";
import {
  addLogoutFeedback,
  getAllLogoutFeedback,
} from "../controllers/logOutFeedbackController.js";
import { authorize } from "../middleware/authMiddleware.js";
const router = Router();

router.post("/v1/add", authorize("user"),addLogoutFeedback);
router.get("/v1/get", getAllLogoutFeedback);

export default router;
