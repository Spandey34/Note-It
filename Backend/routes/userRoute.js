import express from "express";
import { login, logout, signup, userDetails, update } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from '../middleware/multer.js';

const router = express.Router();

router.get("/", authMiddleware,userDetails)
router.post("/login",login)
router.post('/signup',signup);
router.post('/logout',logout);
router.post('/update',authMiddleware,upload.single('profilePic'),update);

export default router