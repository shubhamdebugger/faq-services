import express from "express";
import { signup, login } from "../controllers/userController.js";

const router = express.Router();

router.post("/admin-signup", (req,res)=> signup(req, res, "admin"));
router.post("/admin-login",(req,res)=>  login(req, res, "admin"));

export default router;