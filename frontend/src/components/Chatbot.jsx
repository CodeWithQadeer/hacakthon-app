import { useState, useRef, useEffect } from "react";
import api from "../api/api";
import { MessageSquare, X, Send } from "lucide-react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `👋 Hi! I'm your Smart Assistant 🤖  
Here’s what I can help you with right now:  
• Check your complaint status by title  
• Show your nearby complaints  
• Get help  
  
✨ More exciting features will be available soon!`,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatbotRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chatbotRef.current && !chatbotRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const toggleOpen = () => {
    setOpen((prev) => !prev);
    setInput("");
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      let botReply = "";
      const lowerMsg = userMessage.toLowerCase();

      if (lowerMsg.includes("status") || lowerMsg.includes("complaint")) {
        const titleMatch = userMessage
          .replace(/status|complaint|of|for|about/gi, "")
          .trim()
          .toLowerCase();

        const res = await api.get("/complaints/my");
        const complaints = res.data;

        if (!complaints?.length) {
          botReply = "📭 You don’t have any complaints yet.";
        } else if (titleMatch) {
          const complaint = complaints.find((c) =>
            c.title.toLowerCase().includes(titleMatch)
          );
          botReply = complaint
            ? `📝 Your complaint "${complaint.title}" is currently *${complaint.status}*.`
            : `❌ No complaint found with title similar to "${titleMatch}".`;
        } else {
          botReply =
            "Here are your complaints:\n" +
            complaints.map((c) => `• ${c.title} — ${c.status}`).join("\n");
        }
      } else if (lowerMsg.includes("create")) {
        botReply =
          "🧾 To create a complaint, go to the 'Report' page and fill in details like title, description, image, and location.";
      } else if (lowerMsg.includes("nearby")) {
        botReply =
          "📍 Soon I’ll show complaints near your location — feature coming soon!";
      } else if (lowerMsg.includes("help")) {
        botReply =
          "🤖 You can ask:\n• Check complaint status by title\n• Create complaint\n• Show nearby complaints\n\n✨ More features coming soon!";
      } else {
        botReply =
          "🙃 Sorry, I didn’t get that.\nTry asking like:\n➡ 'Status of garbage complaint'\n➡ 'Show my complaint status'";
      }

      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg flex items-center justify-center z-50 transition-all active:scale-95"
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          ref={chatbotRef}
          className="fixed bottom-20 right-4 md:right-6 w-[90vw] max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col animate-fadeIn"
        >
          {/* Header */}
          <div className="p-3 bg-linear-to-r from-blue-600 to-indigo-600 rounded-t-2xl flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Smart Complaint Bot</h3>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-red-200"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm max-h-[65vh] md:max-h-96 scroll-smooth">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 px-3 rounded-2xl whitespace-pre-wrap max-w-[85%] ${
                  msg.from === "bot"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 self-start"
                    : "bg-linear-to-r from-blue-600 to-indigo-600 text-white self-end ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 text-xs italic">Bot is typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex items-center border-t border-gray-200 dark:border-gray-700 p-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 rounded-lg outline-none dark:bg-gray-700 dark:text-white text-sm md:text-base"
            />
            <button
              type="submit"
              disabled={loading}
              className="ml-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-2 rounded-full disabled:opacity-50 transition-transform active:scale-95"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Chatbot;
