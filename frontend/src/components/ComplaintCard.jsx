import { Link } from "react-router-dom";

const ComplaintCard = ({ c }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "in progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
      default:
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col h-[550px]">
      {/* 🖼️ Image */}
      {c.imageUrl ? (
        <img
          src={c.imageUrl}
          alt={c.title}
          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 text-sm">
          No Image
        </div>
      )}

      {/* 📋 Content */}
      <div className="flex flex-col flex-1 p-5 space-y-2 justify-between">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 leading-snug truncate">
            {c.title}
          </h3>

          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {c.description}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            📍{" "}
            {c.location?.address ||
              `${c.location?.lat?.toFixed(4)}, ${c.location?.lng?.toFixed(4)}`}
          </p>

          {c.userId && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              👤{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {c.userId.name || c.userId.email || "Anonymous"}
              </span>
            </p>
          )}

          <p className="text-sm mt-1">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Status:
            </span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                c.status
              )}`}
            >
              {c.status}
            </span>
          </p>

          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700 h-[70px] overflow-y-auto">
            {c.adminComment ? (
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                💬 <span className="font-semibold">Admin Message:</span>{" "}
                {c.adminComment}
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                💬 Awaiting admin review...
              </p>
            )}
          </div>
        </div>

        {/* 🔗 View Details Button */}
        <div className="pt-3">
          <Link
            to={`/complaints/${c._id}`}
            className="block w-full text-center bg-linear-to-r from-indigo-500 to-pink-500 text-white text-sm font-medium px-5 py-2 rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
