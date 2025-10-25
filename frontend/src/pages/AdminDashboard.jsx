import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllComplaints,
  adminUpdateComplaint,
} from "../features/complaints/complaintsThunks";
import { motion, AnimatePresence } from "framer-motion";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-300",
  Resolved: "bg-green-100 text-green-700 border-green-300",
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.complaints);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [adminComment, setAdminComment] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchAllComplaints());
  }, [dispatch]);

  useEffect(() => {
    if (selected) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [selected]);

  const open = (c) => {
    setSelected(c);
    setStatus(c.status);
    setAdminComment(c.adminComment || "");
  };

  const submitUpdate = async () => {
    if (!selected || isSaving) return;
    setIsSaving(true);

    const res = await dispatch(
      adminUpdateComplaint({
        id: selected._id,
        data: { status, adminComment },
      })
    );

    if (!res.error) {
      setSelected(null);
      setIsSaving(false);
      dispatch(fetchAllComplaints());
    } else {
      alert("❌ Something went wrong!");
      setIsSaving(false);
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
              transition={{ duration: 0.2 }}
              className="rounded-2xl shadow-md p-5 bg-white/80 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 
                         flex flex-col justify-between backdrop-blur-md transition-all duration-300"
            >
              {c.imageUrl && (
                <img
                  src={c.imageUrl}
                  alt={c.title}
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              )}
              <div>
                <h3 className="font-semibold text-lg truncate">{c.title}</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-2">
                  {c.description}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Reported by: {c.userId?.name || "Unknown"}
                </p>

                <div
                  className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium border ${
                    statusColors[c.status] || "bg-gray-200 text-gray-800"
                  }`}
                >
                  {c.status}
                </div>

                <div className="mt-3 bg-gray-50 dark:bg-gray-900/40 p-2 rounded-lg border border-gray-200 dark:border-gray-700 max-h-20 overflow-y-auto">
                  {c.adminComment ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      💬 {c.adminComment}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic text-center">
                      No admin comment yet
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => open(c)}
                className="mt-4 w-full bg-linear-to-r from-indigo-500 to-purple-600 text-white font-medium py-2 rounded-xl shadow hover:shadow-lg transition"
              >
                Review / Update
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* ✅ Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
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
                  disabled={isSaving}
                  className={`px-4 py-2 rounded-lg text-white shadow transition ${
                    isSaving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-linear-to-r from-green-500 to-emerald-600 hover:shadow-lg"
                  }`}
                >
                  {isSaving ? "Saving..." : "Save"}
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
