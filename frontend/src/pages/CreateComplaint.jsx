import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import API from "../api/api";
import { uploadImageToFirebase } from "../firebase/uploadImage";
import { ImagePlus, Loader2, Upload, LocateFixed } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Map click handler
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

// Recenter map
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([Number(lat), Number(lng)], 15);
  }, [lat, lng, map]);
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
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef(null);
  const { token } = useSelector((state) => state.auth);

  // ✅ Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setFormData((prev) => ({
            ...prev,
            lat: latitude.toString(),
            lng: longitude.toString(),
          }));
          setMapKey((prev) => prev + 1);
        },
        () => alert("Please allow location access to use your current location.")
      );
    } else {
      alert("Geolocation not supported on this device.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // ✅ Input change
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
    if (!token) return alert("Please log in to submit a complaint.");
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

      await API.post("/api/complaints", payload, {
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
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 px-3 py-10 sm:py-16 transition-all">
      <div className="w-full max-w-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-4">
          🏙️ Report a Complaint
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter complaint title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the issue..."
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {["Road", "Garbage", "Electricity", "Water", "Other"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Upload Image (optional)
            </label>
            <div
              className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/70 hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition"
              onClick={() => document.getElementById("fileUpload").click()}
            >
              {formData.preview ? (
                <img
                  src={formData.preview}
                  alt="Preview"
                  className="rounded-lg max-h-52 object-cover shadow-md"
                />
              ) : (
                <>
                  <ImagePlus className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 dark:text-gray-400 mb-2" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    Click or drag an image to upload
                  </p>
                </>
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

          {/* Map */}
          <div>
            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
              Select Location on Map
            </label>
            <div className="h-64 sm:h-72 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 relative">
              <MapContainer
                key={mapKey}
                center={[
                  formData.lat ? Number(formData.lat) : 17.385,
                  formData.lng ? Number(formData.lng) : 78.4867,
                ]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                />
                <LocationSelector setFormData={setFormData} />
                {formData.lat && formData.lng && (
                  <>
                    <Marker
                      position={[Number(formData.lat), Number(formData.lng)]}
                    />
                    <RecenterMap lat={formData.lat} lng={formData.lng} />
                  </>
                )}
              </MapContainer>
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              className="mt-3 flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              <LocateFixed className="w-4 h-4" />
              Recenter to My Location
            </button>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center sm:text-left">
              📍 {formData.lat && formData.lng
                ? `${Number(formData.lat).toFixed(4)}, ${Number(formData.lng).toFixed(4)}`
                : "Tap on the map to select a location"}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-semibold rounded-lg bg-linear-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white flex justify-center items-center gap-2 disabled:opacity-50 transition"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;
