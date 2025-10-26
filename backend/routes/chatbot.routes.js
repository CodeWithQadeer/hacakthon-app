const express = require("express");
const router = express.Router();
const { handleChatbotQuery } = require("../controllers/chatbot.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

// Handle preflight
router.options("/", (req, res) => {
  console.log('CHATBOT OPTIONS REQUEST');
  res.status(200).end();
});

router.post("/", (req, res, next) => {
  console.log('CHATBOT POST REQUEST RECEIVED');
  console.log('Body:', req.body);
  next();
}, authMiddleware, handleChatbotQuery);

module.exports = router;
