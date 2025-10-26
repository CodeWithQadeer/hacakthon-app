import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import API from "../api/api";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "👋 Hi! I'm your Complaint Assistant.\n\nI can help you with:\n• View your complaints\n• Check complaint status\n• Get summaries\n\nWhat would you like to do?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { token, user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick action suggestions
  const suggestions = [
    "Show my complaints",
    "Check complaint status",
    "Show latest complaint",
    "How many pending?",
  ];

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  // 🧠 Handle send message
  const sendMessage = async (customMessage = null) => {
    const messageText = customMessage || input.trim();
    if (!messageText) return;

    setShowSuggestions(false);
    const userMsg = { type: "user", text: messageText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const currentToken = token || localStorage.getItem("token");

    try {
      if (!currentToken) {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "🔒 Please log in to check your complaints.",
            timestamp: new Date(),
          },
        ]);
        setLoading(false);
        return;
      }

      let botResponse = "🤖 I didn't quite get that.";

      // Fetch complaints from Render API
      const res = await API.get(
        "https://improve-my-city.onrender.com/api/complaints",
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        }
      );

      const complaints = res.data || [];

      // Match complaints by user ID (backend returns user info inside each complaint)
      const userComplaints = complaints.filter(
        (c) => c.user?._id === user?._id
      );

      // Handle various message cases
      if (
        messageText.toLowerCase().includes("my complaints") ||
        messageText.toLowerCase().includes("show complaints")
      ) {
        if (userComplaints.length > 0) {
          botResponse = userComplaints
            .slice(-5)
            .map(
              (c) =>
                `🆔 ${c._id}\n📄 ${c.title}\n📅 ${new Date(
                  c.createdAt
                ).toLocaleDateString()}\n📍 Status: ${c.status}`
            )
            .join("\n\n");
          botResponse = `📋 Here are your latest complaints:\n\n${botResponse}`;
        } else {
          botResponse = "😕 You don't have any complaints yet.";
        }
      } else if (messageText.toLowerCase().includes("latest")) {
        const latest = userComplaints[userComplaints.length - 1];
        botResponse = latest
          ? `🆔 ${latest._id}\n📄 ${latest.title}\n📅 ${new Date(
              latest.createdAt
            ).toLocaleString()}\n📍 Status: ${latest.status}`
          : "No complaints found.";
      } else if (messageText.toLowerCase().includes("pending")) {
        const pending = userComplaints.filter(
          (c) => c.status?.toLowerCase() === "pending"
        );
        botResponse = `⏳ You have ${pending.length} pending complaints.`;
      } else if (messageText.toLowerCase().includes("status")) {
        botResponse =
          "Please provide your complaint ID (e.g., 'status 6534abcd...') to check.";
      } else if (messageText.toLowerCase().startsWith("status")) {
        const parts = messageText.split(" ");
        const complaintId = parts[1];
        const found = userComplaints.find((c) => c._id === complaintId);
        if (found) {
          botResponse = `📦 Complaint Status: ${found.status}\n📝 ${
            found.title || "No description available"
          }`;
        } else {
          botResponse = "⚠️ No complaint found with that ID under your account.";
        }
      }

      // Add bot reply
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: botResponse, timestamp: new Date() },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "😔 Error fetching complaint data. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (text) => sendMessage(text);
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        type: "bot",
        text: "🧹 Chat cleared! How can I help you?",
        timestamp: new Date(),
      },
    ]);
    setShowSuggestions(true);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 z-50 w-[90%] sm:w-[400px] h-[70vh] sm:h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold text-lg">AI Complaint Assistant</h3>
              </div>
              <button
                onClick={clearChat}
                className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30"
              >
                Clear
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl ${
                      msg.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border"
                    } text-sm shadow-sm whitespace-pre-wrap`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border p-3 rounded-2xl flex space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              )}

              {showSuggestions && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="text-xs bg-white dark:bg-gray-800 border px-2 py-2 rounded-lg hover:border-blue-500 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-gray-800 border-t flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 px-3 py-2 rounded-xl border text-sm dark:bg-gray-900 dark:text-gray-100"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
