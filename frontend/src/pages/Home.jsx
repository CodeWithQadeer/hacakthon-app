import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wrench, MapPin, Building2, Users } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-700 px-4">
      
      {/* 🌆 Animated Background Icons */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="absolute top-20 left-16 text-blue-400 dark:text-blue-700"
          animate={{ y: [0, 15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Building2 size={80} />
        </motion.div>

        <motion.div
          className="absolute bottom-28 right-20 text-purple-500 dark:text-purple-700"
          animate={{ y: [0, -20, 0], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wrench size={70} />
        </motion.div>

        <motion.div
          className="absolute bottom-16 left-24 text-pink-500 dark:text-pink-700"
          animate={{ y: [0, 25, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <MapPin size={70} />
        </motion.div>

        <motion.div
          className="absolute top-28 right-16 text-indigo-500 dark:text-indigo-700"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Users size={70} />
        </motion.div>
      </motion.div>

      {/* 💬 Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative backdrop-blur-xl bg-white/60 dark:bg-gray-900/50 rounded-3xl shadow-2xl p-10 md:p-16 max-w-2xl text-center border border-gray-200/40 dark:border-gray-700/40 z-10"
      >
        <motion.img
          src="/logo.png"
          alt="CivFix Logo"
          className="w-24 h-24 mx-auto mb-4 drop-shadow-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
        />

        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 mb-4">
          CivFix
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed">
          Empower your community by reporting civic issues —{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            transparently, efficiently, and together.
          </span>
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8"
        >
          <button
            onClick={() => navigate("/create-complaint")}
            className="px-10 py-4 rounded-full font-semibold bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-xl hover:shadow-indigo-400/25 transition-all duration-300 text-lg"
          >
            Report a Complaint 🚧
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
