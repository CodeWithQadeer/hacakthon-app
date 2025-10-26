import express from "express";
import { handleChatbotQuery } from "../controllers/chatbot.controller.js";

const router = express.Router();

// ✅ POST /api/chatbot
router.post("/", handleChatbotQuery);

export default router;
