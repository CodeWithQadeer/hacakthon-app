import Complaint from "../models/Complaint.js";

// ✅ Admin can update complaint status (Pending → In Progress → Resolved)
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, adminComment } = req.body;
    const { id } = req.params;

    // Validate status
    const allowedStatuses = ["Pending", "In Progress", "Resolved"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findById(id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status;
    if (adminComment) complaint.adminComment = adminComment;

    await complaint.save();

    res.json({ message: "Complaint status updated successfully", complaint });
  } catch (err) {
    next(err);
  }
};

export const updateAdminComment = async (req, res, next) => {
  try {
    const { adminComment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.adminComment = adminComment || complaint.adminComment;
    await complaint.save();

    res.json({ message: "Admin comment updated", complaint });
  } catch (err) {
    next(err);
  }
};