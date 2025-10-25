import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../api/api";
import { uploadImageToFirebase } from "../firebase/uploadImage";
import { ImagePlus, Loader2, Upload } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle map click event
const LocationSelector = ({ setFormData }) => {
  useMapEvents({
    click(e) {
      setFormData((prev) => ({
        ...prev,
        lat: e.latlng.lat.toString(),
        lng: e.latlng.lng.toString(),
      }));
    },
  });
  return null;
};

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

  // ✅ Get user current location
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
        () => alert("Please allow location access to use current location.")
      );
    }
  }, []);

  // ✅ Handle form input
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

  // ✅ Submit complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("You must be logged in to submit a complaint.");
    if (!formData.title || !formData.description || !formData.lat || !formData.lng)
      return alert("Please fill all fields and select a location on the map.");

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
      <div className="w-full max-w-xl backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 shadow-2xl rounded-2xl border border-gray-300/30 dark:border-gray-700/30 p-8">
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
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Road">Road</option>
              <option value="Garbage">Garbage</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* 🌆 Image Upload */}
          <div>
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
              Upload Image (optional)
            </label>
            <div
              className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/70 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition-all"
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

          {/* 🗺️ Location Picker */}
          <div>
            <label className="block font-medium mb-2 text-gray-700 dark:text-gray-300">
              Select Location on Map
            </label>
            <div className="h-64 rounded-lg overflow-hidden border dark:border-gray-700">
              <MapContainer
                center={[
                  formData.lat ? Number(formData.lat) : 17.385,
                  formData.lng ? Number(formData.lng) : 78.4867,
                ]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                />
                <LocationSelector setFormData={setFormData} />
                {formData.lat && formData.lng && (
                  <Marker
                    position={[Number(formData.lat), Number(formData.lng)]}
                  />
                )}
              </MapContainer>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              📍 Selected:{" "}
              {formData.lat && formData.lng
                ? `${Number(formData.lat).toFixed(4)}, ${Number(formData.lng).toFixed(4)}`
                : "Click on the map to select a location"}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold rounded-lg bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white flex justify-center items-center gap-2 disabled:opacity-50 transition"
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
