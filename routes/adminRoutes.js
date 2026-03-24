import express from "express";
import { signup, login } from "../controllers/userController.js";

const router = express.Router();

router.post("/v1/admin-signup", (req,res)=> signup(req, res, "admin"));
router.post("/v1/admin-login",(req,res)=>  login(req, res, "admin"));

export default router;