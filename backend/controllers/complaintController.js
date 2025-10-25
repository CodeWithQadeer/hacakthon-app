// controllers/complaintController.js
import Complaint from "../models/Complaint.js";
import { getAddressFromCoords } from "../utils/geocoding.js";

/* 🟢 CREATE COMPLAINT (USER) */
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, imageUrl, lat, lng } = req.body;

    if (!title || !description || !lat || !lng) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    // Get address using coordinates
    const address = await getAddressFromCoords(lat, lng);

    // Create complaint
    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      description,
      category,
      imageUrl,
      location: { lat, lng, address },
    });

    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (err) {
    next(err);
  }
};

/* 🟡 GET COMPLAINTS BY LOGGED-IN USER */
export const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(complaints);
  } catch (err) {
    next(err);
  }
};

/* 🟠 GET ALL COMPLAINTS (ADMIN + PUBLIC FEED) */
export const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .populate("userId", "name email") // ✅ populate user info
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

/* 🔵 GET COMPLAINT BY ID */
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    res.status(200).json(complaint);
  } catch (err) {
    next(err);
  }
};

/* 🟣 GET COMPLAINT STATUS (USER VIEW) */
export const getComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({
      status: complaint.status,
      message: `Your complaint is currently: ${complaint.status}`,
    });
  } catch (err) {
    next(err);
  }
};

/* 🔴 ADMIN: UPDATE COMPLAINT STATUS / ADMIN MESSAGE */
export const updateComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminMessage } = req.body;

    const complaint = await Complaint.findById(id).populate(
      "userId",
      "name email"
    );
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    // Update complaint details
    if (status) complaint.status = status;
    if (adminMessage) complaint.adminMessage = adminMessage;

    await complaint.save();

    res.status(200).json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (err) {
    next(err);
  }
};
