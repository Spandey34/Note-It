import express from "express";
import { add, remove, show, toggleMarked, update } from "../controllers/linkController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:id", authMiddleware, show);
router.post("/add", authMiddleware, add);
router.post("/remove/:id", authMiddleware, remove);
router.post("/update/:id", authMiddleware, update);
router.post("/toggle/:id", authMiddleware, toggleMarked);

export default router