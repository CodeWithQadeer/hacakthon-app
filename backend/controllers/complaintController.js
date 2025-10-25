// controllers/complaintController.js
import Complaint from "../models/Complaint.js";
import { getAddressFromCoords } from "../utils/geocoding.js";

// 🟢 Create complaint
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, imageUrl, lat, lng } = req.body;

    if (!title || !description || !lat || !lng)
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });

    const address = await getAddressFromCoords(lat, lng);

    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      description,
      category,
      imageUrl,
      location: { lat, lng, address },
    });

    res
      .status(201)
      .json({ message: "Complaint created successfully", complaint });
  } catch (err) {
    next(err);
  }
};

// 🟡 Get complaints by logged-in user
export const getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

// 🟠 Get all complaints (admin only)
export const getAllComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

// 🔵 Get complaint by ID
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    res.json(complaint);
  } catch (err) {
    next(err);
  }
};

// 🟣 Get complaint status (for user view)
export const getComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      status: complaint.status,
      message: `Your complaint is currently: ${complaint.status}`,
    });
  } catch (err) {
    next(err);
  }
};

// 🔴 Admin: Update complaint status/message (email logic removed)
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

    res.json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (err) {
    next(err);
  }
};
