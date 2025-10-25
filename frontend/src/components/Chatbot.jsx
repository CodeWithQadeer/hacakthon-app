//src/components/Chatbot.jsx

import { useState } from "react";
import api from "../api/api";
import { MessageSquare, X } from "lucide-react";

const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const toggleOpen = () => {
        setOpen((prev) => !prev);
        setResponse("");
        setTitle("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) return;

        setLoading(true);
        setResponse("");

        try {
            const res = await api.get("/complaints/my");
            const complaints = res.data;

            const complaint = complaints.find(
                (c) => c.title.toLowerCase() === title.toLowerCase()
            );

            if (!complaint) {
                setResponse("Complaint not found. Please check the title.");
            } else {
                setResponse(`⁠Your complaint "${complaint.title}" is currently: ${complaint.status}`);
            }
        } catch (err) {
            console.error(err);
            setResponse("⚠ Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating button */}
            <button
                onClick={toggleOpen}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 transition"
            >
                {open ? <X size={24} /> : <MessageSquare size={24} />}
            </button>

            {/* Chat panel */}
            {open && (
                <div className="fixed bottom-20 right-6 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-300 dark:border-gray-700 z-50 p-4 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
                        Complaint Chatbot
                    </h3>

                    {/* Form to input complaint title */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="Type your complaint title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Checking..." : "Submit"}
                        </button>
                    </form>

                    {/* Response */}
                    {response && (
                        <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-100">
                            {response}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Chatbot;