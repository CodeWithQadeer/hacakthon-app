// src/pages/Home.jsx
import { motion } from "framer-motion";

const Home = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-700 px-4">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="backdrop-blur-xl bg-white/60 dark:bg-gray-900/50 rounded-3xl shadow-2xl p-10 max-w-xl text-center border border-gray-200/40 dark:border-gray-700/40"
    >
      <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-4">
        Improve My City
      </h1>
      <p className="text-gray-700 dark:text-gray-300 text-lg">
        Empower your community by reporting civic issues —{" "}
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          transparently and effectively.
        </span>
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-8"
      >
        <button
          onClick={() => (window.location.href = "/complaints")}
          className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
        >
          Report a Complaint
        </button>
      </motion.div>
    </motion.div>
  </div>
);

export default Home;
