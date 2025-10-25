import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllComplaints } from "../features/complaints/complaintsThunks";
import ComplaintCard from "../components/ComplaintCard";
import { motion, AnimatePresence } from "framer-motion";

const Complaints = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.complaints);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllComplaints());
  }, [dispatch]);

  const filteredList = useMemo(() => {
    return list.filter((c) => {
      const matchesSearch = c.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        c.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [list, search, statusFilter]);

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-all duration-500
        bg-linear-to-br from-sky-50 via-white to-emerald-50
        dark:from-gray-900 dark:via-gray-950 dark:to-black
        text-gray-900 dark:text-gray-100 rounded-2xl`}
    >
      {/* Header Section */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-center sm:text-left text-gray-800 dark:text-gray-100 drop-shadow-sm">
          All Complaints
        </h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
          bg-white/70 dark:bg-gray-800/60 backdrop-blur-md focus:ring-2 focus:ring-blue-500 
          outline-none transition-all duration-300 text-gray-900 dark:text-gray-100 placeholder-gray-400"
        />
      </div>

      {/* ✅ Filter Buttons */}
      <div className="flex justify-center flex-wrap gap-3 mb-8">
        {["all", "pending", "in progress", "resolved"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize border transition-all duration-300 ${
              statusFilter === status
                ? "bg-indigo-500 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-indigo-100 dark:hover:bg-gray-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-md"
            ></div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <p className="text-center text-red-600 dark:text-red-400 mt-10">
          {error}
        </p>
      )}

      {/* Empty State */}
      {!loading && !error && filteredList.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No complaints found.
          </p>
        </div>
      )}

      {/* Complaints Grid */}
      <AnimatePresence>
        {!loading && !error && filteredList.length > 0 && (
          <motion.div
            layout
            className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredList.map((c) => (
              <motion.div
                key={c._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ComplaintCard c={c} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Complaints;
