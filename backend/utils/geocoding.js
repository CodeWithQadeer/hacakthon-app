import axios from "axios";

export const getAddressFromCoords = async (lat, lng) => {
  try {
    const key = process.env.GOOGLE_MAPS_API_KEY;
    if (!key) return "Unknown location";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`;
    const { data } = await axios.get(url);
    return data.results?.[0]?.formatted_address || "Unknown location";
  } catch {
    return "Unknown location";
  }
};
