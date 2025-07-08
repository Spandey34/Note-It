import express from "express";
import { addTopic, deleteTopic, getTopic, renameTopic, showTopics } from "../controllers/topicController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, showTopics);
router.get("/:id",authMiddleware, getTopic);
router.post("/add", authMiddleware, addTopic);
router.post("/delete/:id", authMiddleware, deleteTopic);
router.post("/rename/:id", authMiddleware, renameTopic);

export default router