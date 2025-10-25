import { Link } from "react-router-dom";

const ComplaintCard = ({ c }) => {
  // 🟢 Dynamic status color styles
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
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col h-[540px]">
      {/* 🖼️ Image Section */}
      {c.imageUrl ? (
        <img
          src={c.imageUrl}
          alt={c.title}
          className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-52 bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 text-sm">
          No Image
        </div>
      )}

      {/* 📋 Content Section */}
      <div className="flex flex-col justify-between flex-1 p-5">
        <div className="flex flex-col grow overflow-hidden">
          {/* Title */}
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
            {c.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-2">
            {c.description}
          </p>

          {/* Location */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            📍{" "}
            {c.location?.address ||
              `${c.location?.lat?.toFixed(4)}, ${c.location?.lng?.toFixed(4)}`}
          </p>

          {/* User Info */}
          {c.userId && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              👤 Reported by:{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {c.userId.name || c.userId.email || "Anonymous"}
              </span>
            </p>
          )}

          {/* Status */}
          <p className="text-sm mt-3">
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

          {/* Admin Message */}
          <div className="mt-3 grow min-h-[70px] max-h-[90px] overflow-y-auto p-3 bg-gray-100 dark:bg-gray-800/60 rounded-lg border border-gray-200 dark:border-gray-700">
            {c.adminMessage ? (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                💬 <span className="font-semibold">Admin Message:</span>{" "}
                {c.adminMessage}
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                💬 Awaiting admin review...
              </p>
            )}
          </div>
        </div>

        {/* 🔗 View Details Button */}
        <div className="mt-4">
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
