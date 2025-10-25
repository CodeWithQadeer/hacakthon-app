import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllComplaints } from "../features/complaints/complaintsThunks";
import ComplaintCard from "../components/ComplaintCard";

const Complaints = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.complaints);

  useEffect(() => {
    dispatch(fetchAllComplaints());
  }, [dispatch]);

  return (
    <div
      className={`min-h-screen px-6 py-10 transition-all duration-500
        bg-gradient-to-br from-sky-50 via-white to-emerald-50
        dark:from-gray-900 dark:via-gray-950 dark:to-black
        text-gray-900 dark:text-gray rounded-2xl`}
    >
     <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100 drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
  All Complaints
</h2>


      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading complaints...
        </p>
      )}

      {error && (
        <p className="text-center text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && list.length === 0 && (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No complaints found.
        </p>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((c) => (
          <ComplaintCard key={c._id} c={c} />
        ))}
      </div>
    </div>
  );
};

export default Complaints;
