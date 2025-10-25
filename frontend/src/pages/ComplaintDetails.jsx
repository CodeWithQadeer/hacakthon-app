import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComplaintById } from "../features/complaints/complaintsThunks";
import { motion, AnimatePresence } from "framer-motion";

const ComplaintDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, error } = useSelector((s) => s.complaints);
  const overlayRef = useRef(null);

  useEffect(() => {
    dispatch(fetchComplaintById(id));
  }, [id, dispatch]);

  // Close when clicking outside
  const handleClickOutside = (e) => {
    if (e.target === overlayRef.current) navigate(-1);
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        onClick={handleClickOutside}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-2xl mx-4 rounded-2xl shadow-lg overflow-hidden
          bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border border-white/30 dark:border-gray-700/30"
          initial={{ scale: 0.9, rotateY: -10, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1 }}
          exit={{ scale: 0.9, rotateY: 10, opacity: 0 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          {loading && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-300">
              Loading complaint details...
            </div>
          )}

          {error && (
            <div className="p-6 text-center text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {current && (
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {current.title}
              </h2>

              <p className="text-gray-700 dark:text-gray-300">
                {current.description}
              </p>

              {current.imageUrl && (
                <img
                  src={current.imageUrl}
                  alt="complaint"
                  className="rounded-lg w-full max-h-80 object-cover shadow"
                />
              )}

              <p className="text-sm text-gray-600 dark:text-gray-400">
                📍{" "}
                {current.location?.address ||
                  `${current.location?.lat}, ${current.location?.lng}`}
              </p>

              <p className="font-medium text-gray-800 dark:text-gray-200">
                Status:{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {current.status}
                </span>
              </p>

              {current.adminComment && (
                <p className="italic text-gray-700 dark:text-gray-300">
                  💬 Admin note: {current.adminComment}
                </p>
              )}

              {/* Close button */}
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
              >
                ✕
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComplaintDetails;
