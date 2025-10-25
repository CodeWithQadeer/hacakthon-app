// src/App.jsx
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Chatbot from "./components/Chatbot";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div
      className="h-screen flex flex-col bg-gray-100 dark:bg-gray-950 
      text-gray-900 dark:text-gray-100 transition-colors duration-500
      overflow-hidden"
    >
      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 w-full z-50">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      </header>

      {/* Main section fills remaining height */}
      <main
        className="flex-1 overflow-y-auto pt-[72px] px-4 sm:px-6 md:px-10"
        style={{
          height: "calc(100vh - 72px)", // Adjust if your Navbar height differs
        }}
      >
        <AppRoutes />
      </main>

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
}

export default App;
