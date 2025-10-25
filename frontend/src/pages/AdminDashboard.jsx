// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllComplaints,
  adminUpdateComplaint,
} from "../features/complaints/complaintsThunks";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.complaints);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [adminComment, setAdminComment] = useState("");

  useEffect(() => {
    dispatch(fetchAllComplaints());
  }, [dispatch]);

  const open = (c) => {
    setSelected(c);
    setStatus(c.status);
    setAdminComment(c.adminComment || "");
  };

  const submitUpdate = async () => {
    if (!selected) return;
    const res = await dispatch(
      adminUpdateComplaint({
        id: selected._id,
        data: { status, adminComment },
      })
    );
    if (!res.error) {
      alert("✅ Complaint updated successfully!");
      setSelected(null);
    } else {
      alert("❌ Something went wrong!");
    }
  };

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center">
        🛠️ Admin Dashboard
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading complaints...
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.map((c) => (
            <motion.div
              key={c._id}
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl shadow-md p-5 transition-all duration-300 
                         bg-white/70 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200 dark:border-gray-700"
            >
              {c.imageUrl && (
                <img
                  src={c.imageUrl}
                  alt={c.title}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              )}
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                {c.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Reported by: {c.userId?.name || "Unknown"}
              </p>
              <p className="text-sm mt-2">
                <span className="font-medium text-indigo-500 dark:text-indigo-400">
                  Status:
                </span>{" "}
                {c.status}
              </p>

              {c.adminComment && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
                  💬 {c.adminComment}
                </p>
              )}

              <button
                onClick={() => open(c)}
                className="mt-3 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-2 rounded-xl shadow hover:shadow-lg transition"
              >
                Review / Update
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for editing complaint */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold mb-2">{selected.title}</h3>
              {selected.imageUrl && (
                <img
                  src={selected.imageUrl}
                  alt={selected.title}
                  className="w-full h-52 object-cover rounded-xl mb-3"
                />
              )}
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {selected.description}
              </p>

              <textarea
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 p-3 rounded-lg mt-2 focus:ring-2 focus:ring-indigo-500"
                rows="3"
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="Add admin comment (optional)"
              />

              <select
                className="w-full mt-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={submitUpdate}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:shadow-lg transition"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
