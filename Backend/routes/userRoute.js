import express from "express";
import { login, logout, signup, userDetails, update } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware,userDetails)
router.post("/login",login)
router.post('/signup',signup);
router.post('/logout',logout);
router.post('/update',authMiddleware,update);

export default router