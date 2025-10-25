import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../api/api";
import { uploadImageToFirebase } from "../firebase/uploadImage";
import { ImagePlus, Loader2, Upload } from "lucide-react"; // ✅ modern icons

const CreateComplaint = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Other",
    image: null,
    preview: null,
    lat: "",
    lng: "",
  });

  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);

  // ✅ Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData((prev) => ({
            ...prev,
            lat: latitude.toString(),
            lng: longitude.toString(),
          }));
        },
        () => alert("Please allow location access to submit a complaint.")
      );
    }
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
        preview: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in to submit a complaint.");

    if (!formData.title || !formData.description || !formData.lat || !formData.lng)
      return alert("Please fill in all required fields and allow location access.");

    setLoading(true);
    try {
      let imageUrl = "";
      if (formData.image) imageUrl = await uploadImageToFirebase(formData.image);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        imageUrl,
        lat: Number(formData.lat),
        lng: Number(formData.lng),
      };

      await API.post("/complaints", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Complaint submitted successfully!");
      setFormData({
        title: "",
        description: "",
        category: "Other",
        image: null,
        preview: null,
        lat: formData.lat,
        lng: formData.lng,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-10 bg-gray-100 dark:bg-gray-950 transition-colors duration-500">
      <div className="w-full max-w-xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 shadow-2xl rounded-2xl border border-gray-300/30 dark:border-gray-700/30 p-8 transition-all duration-500 hover:shadow-blue-400/20 dark:hover:shadow-blue-500/30">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          🏙️ Report a Complaint
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter complaint title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the issue..."
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="Road">Road</option>
              <option value="Garbage">Garbage</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* 🌆 Image Upload (modern style) */}
          <div>
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
              Upload Image (optional)
            </label>
            <div
              className="
                relative border-2 border-dashed 
                border-gray-300 dark:border-gray-700 
                rounded-xl p-6 flex flex-col items-center justify-center 
                cursor-pointer hover:border-blue-500/70 hover:bg-blue-50/40 dark:hover:bg-blue-900/20
                transition-all duration-300
              "
              onClick={() => document.getElementById("fileUpload").click()}
            >
              {formData.preview ? (
                <img
                  src={formData.preview}
                  alt="Preview"
                  className="rounded-lg max-h-48 object-cover shadow-md"
                />
              ) : (
                <div className="text-center">
                  <ImagePlus className="mx-auto mb-3 w-12 h-12 text-gray-500 dark:text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Click or drag an image to upload
                  </p>
                </div>
              )}
              <input
                id="fileUpload"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-100/70 dark:bg-gray-800/60 border border-gray-300/30 dark:border-gray-700/30 p-3 rounded-lg text-sm text-gray-800 dark:text-gray-300">
            <p>
              <strong>Latitude:</strong> {formData.lat || "Fetching..."}
            </p>
            <p>
              <strong>Longitude:</strong> {formData.lng || "Fetching..."}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Upload className="w-5 h-5" />}
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
