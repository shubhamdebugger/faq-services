import express from "express";
import { signup, login } from "../controllers/userController.js";

const router = express.Router();

router.post("/v1/signup", (req,res)=> signup(req, res, "user"));
router.post("/v1/login",(req,res)=>  login(req, res, "user"));
export default router;