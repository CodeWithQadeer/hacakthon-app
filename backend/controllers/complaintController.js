import Complaint from "../models/Complaint.js";
import { getAddressFromCoords } from "../utils/geocoding.js";

export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, imageUrl, lat, lng } = req.body;

    if (!title || !description || !lat || !lng)
      return res.status(400).json({ message: "All required fields must be filled" });

    const address = await getAddressFromCoords(lat, lng);

    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      description,
      category,
      imageUrl,
      location: { lat, lng, address }
    });

    res.status(201).json({ message: "Complaint created", complaint });
  } catch (err) {
    next(err);
  }
};

export const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

export const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find().populate("userId", "name email");
    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("userId", "name email");
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    res.json(complaint);
  } catch (err) {
    next(err);
  }
};