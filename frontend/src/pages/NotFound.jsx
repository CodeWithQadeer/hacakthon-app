// src/pages/NotFound.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/50 rounded-3xl shadow-2xl p-10 text-center border border-gray-200/40 dark:border-gray-700/40 max-w-md"
      >
        <h2 className="text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-red-600 via-purple-600 to-blue-600 mb-4">
          404
        </h2>
        <p className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Page Not Found
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="px-8 py-3 rounded-xl font-semibold bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          Go Back Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NotFound;
