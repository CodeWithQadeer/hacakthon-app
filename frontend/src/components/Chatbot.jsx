// src/components/Chatbot.jsx
import { useState, useRef, useEffect } from "react";
import api from "../api/api";
import { MessageSquare, X } from "lucide-react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: `👋 Hi! I'm your Smart Assistant 🤖  
How can I help you today?`,
      options: [
        "📋 Check Complaint Status",
        "🧾 How to Create Complaint",
        "📍 Show Nearby Complaints",
        "❓ Help",
      ],
    },
  ]);

  const chatbotRef = useRef(null);
  const messagesEndRef = useRef(null);

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

  const toggleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleOptionClick = async (option) => {
    setMessages((prev) => [...prev, { from: "user", text: option }]);

    let botReply = "";

    try {
      if (option.includes("Status")) {
        const res = await api.get("/complaints/my");
        const complaints = res.data;

        if (!complaints?.length) {
          botReply = "📭 You don’t have any complaints yet.";
        } else {
          botReply =
            "📝 Here are your recent complaints:\n" +
            complaints
              .map((c) => `• ${c.title} — ${c.status}`)
              .join("\n");
        }
      } else if (option.includes("Create")) {
        botReply =
          "🧾 To create a complaint, go to the 'Report' page and fill in details like title, description, image, and location.";
      } else if (option.includes("Nearby")) {
        botReply =
          "📍 Nearby complaints feature is coming soon! Stay tuned 🚀";
      } else if (option.includes("Help")) {
        botReply =
          "🤖 You can tap on any of the options below to quickly get info.\n\n💡 More features & typing ability coming soon!";
      }

      // Append bot message
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: botReply,
          options: [
            "📋 Check Complaint Status",
            "🧾 How to Create Complaint",
            "📍 Show Nearby Complaints",
            "❓ Help",
          ],
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "⚠ Something went wrong. Please try again.",
        },
      ]);
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
            <h3 className="text-lg font-semibold text-white">
              Smart Complaint Bot
            </h3>
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
              <div key={i} className="flex flex-col space-y-1">
                <div
                  className={`p-2 px-3 rounded-2xl whitespace-pre-wrap max-w-[85%] ${
                    msg.from === "bot"
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 self-start"
                      : "bg-linear-to-r from-blue-600 to-indigo-600 text-white self-end ml-auto"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.options && msg.from === "bot" && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        className="px-3 py-1.5 text-xs md:text-sm bg-linear-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:opacity-90 active:scale-95 transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer message */}
          <div className="text-center text-xs text-gray-400 dark:text-gray-500 p-2 border-t border-gray-200 dark:border-gray-700">
            💡 More features & typing ability coming soon!
          </div>
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
