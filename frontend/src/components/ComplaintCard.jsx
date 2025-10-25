import { Link } from "react-router-dom";

const ComplaintCard = ({ c }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-800">
      {/* Image Section */}
      {c.imageUrl && (
        <img
          src={c.imageUrl}
          alt={c.title}
          className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
        />
      )}

      {/* Content Section */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
          {c.title}
        </h3>

        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">
          {c.description}
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          📍{" "}
          {c.location?.address ||
            `${c.location?.lat?.toFixed(4)}, ${c.location?.lng?.toFixed(4)}`}
        </p>

        <p className="text-sm mt-3">
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            Status:
          </span>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              c.status === "resolved"
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                : c.status === "pending"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
            }`}
          >
            {c.status}
          </span>
        </p>

        {/* Admin Comment */}
        {c.adminComment && (
          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              💬 <span className="font-semibold">Admin Comment:</span>{" "}
              {c.adminComment}
            </p>
          </div>
        )}

        {/* View Details Button */}
        <div className="mt-4">
          <Link
            to={`/complaints/${c._id}`}
            className="inline-block bg-linear-to-r from-indigo-500 to-pink-500 text-white text-sm font-medium px-4 py-2 rounded-full hover:shadow-md transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
