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

  // ✅ Close modal when clicking outside
  const handleClickOutside = (e) => {
    if (e.target === overlayRef.current) navigate(-1);
  };

  // ✅ Dynamic color for status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-400";
      case "in progress":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/30 dark:text-yellow-400";
      case "pending":
        return "bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        onClick={handleClickOutside}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-2xl mx-4 rounded-2xl shadow-2xl 
          bg-white/90 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-700/40
          max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.4, type: 'spring' }}
        >
          {/* Close button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 transition"
          >
            ✕
          </button>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Loading */}
            {loading && (
              <p className="text-center text-gray-500 dark:text-gray-300">
                Loading complaint details...
              </p>
            )}

            {/* Error */}
            {error && (
              <p className="text-center text-red-600 dark:text-red-400">{error}</p>
            )}

            {/* Complaint Details */}
            {current && (
              <>
                {/* 🧑 Created by User */}
                <div className="flex items-center justify-between bg-linear-to-r from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 p-4 rounded-xl shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                      {current.userId?.name
                        ? current.userId.name[0].toUpperCase()
                        : "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                        {current.userId?.name || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {current.userId?.email || "No email available"}
                      </p>
                    </div>
                  </div>

                  {/* 🕒 Created At */}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Created on{" "}
                    {new Date(current.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* 📝 Title & Description */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {current.title}
                  </h2>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                    {current.description}
                  </p>
                </div>

                {/* 🖼️ Image */}
                {current.imageUrl && (
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={current.imageUrl}
                      alt="complaint"
                      className="w-full max-h-80 object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                {/* 📍 Location */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  📍{" "}
                  {current.location?.address ||
                    `${current.location?.lat}, ${current.location?.lng}`}
                </p>

                {/* 🗺️ Map View */}
                {current.location?.lat && current.location?.lng && (
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Location on Map:
                    </h3>
                    <iframe
                      title="Complaint Location"
                      width="100%"
                      height="300"
                      loading="lazy"
                      allowFullScreen
                      className="rounded-lg shadow"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${current.location.lat},${current.location.lng}&z=15&output=embed`}
                    ></iframe>
                  </div>
                )}

                {/* 🟢 Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    Status:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      current.status
                    )}`}
                  >
                    {current.status || "Pending"}
                  </span>
                </div>

                {/* 💬 Admin Comment */}
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Admin Comment:
                  </h3>
                  {current.adminComment ? (
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
                      {current.adminComment}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      No admin comment yet.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ComplaintDetails;
