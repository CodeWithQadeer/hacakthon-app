import Complaint from "../models/Complaint.js";
import { sendEmail } from "../utils/sendEmail.js"; // 📧 Import the mail utility

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

    // Fetch complaint with user details
    const complaint = await Complaint.findById(id).populate("userId", "name email");
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    // Update values
    complaint.status = status;
    if (adminComment) complaint.adminComment = adminComment;
    await complaint.save();

    // ✉️ Email details
    const subject = `Update on Your Complaint: "${complaint.title}"`;
    const text = `
Dear ${complaint.userId.name},

Your complaint titled "${complaint.title}" has been updated by the admin.

🟢 Current Status: ${complaint.status}
💬 Admin Comment: ${adminComment || "No comment provided."}

Thank you for helping us improve our city.

Warm regards,
The Improve My City Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2563eb;">Complaint Update</h2>
        <p>Dear <strong>${complaint.userId.name}</strong>,</p>
        <p>Your complaint titled <strong>"${complaint.title}"</strong> has been updated by our team.</p>
        <p><strong>Status:</strong> <span style="color: #16a34a;">${complaint.status}</span></p>
        <p><strong>Admin Comment:</strong> ${adminComment || "No comment provided."}</p>
        <p>Thank you for helping us make our city better!</p>
        <br />
        <p style="font-size: 14px; color: #555;">Best regards,</p>
        <p style="font-size: 14px; color: #2563eb;"><strong>Improve My City Team</strong></p>
        <p style="font-size: 12px; color: #888;">This is an automated email — please do not reply.</p>
      </div>
    `;

    // 📤 Send the email
    console.log("📨 Sending email to:", complaint.userId.email);
    await sendEmail(complaint.userId.email, subject, text, html);
    console.log("✅ Email sent successfully");

    res.json({ message: "Complaint status updated and email sent", complaint });
  } catch (err) {
    next(err);
  }
};

// ✅ Admin can update comment only
export const updateAdminComment = async (req, res, next) => {
  try {
    const { adminComment } = req.body;
    const complaint = await Complaint.findById(req.params.id).populate("userId", "name email");

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.adminComment = adminComment || complaint.adminComment;
    await complaint.save();

    // ✉️ Send email for comment update
    const subject = `New Comment on Your Complaint: "${complaint.title}"`;
    const text = `
Dear ${complaint.userId.name},

An admin has added a comment to your complaint titled "${complaint.title}".

💬 Admin Comment: ${adminComment || "No comment provided."}

Thank you for helping us improve our city.

Warm regards,
The Improve My City Team
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; background: #f9fafb; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2563eb;">New Admin Comment</h2>
        <p>Dear <strong>${complaint.userId.name}</strong>,</p>
        <p>An admin has added a comment on your complaint titled <strong>"${complaint.title}"</strong>.</p>
        <p><strong>Admin Comment:</strong> ${adminComment || "No comment provided."}</p>
        <br />
        <p style="font-size: 14px; color: #555;">Best regards,</p>
        <p style="font-size: 14px; color: #2563eb;"><strong>Improve My City Team</strong></p>
        <p style="font-size: 12px; color: #888;">This is an automated email — please do not reply.</p>
      </div>
    `;

    console.log("📨 Sending email to:", complaint.userId.email);
    await sendEmail(complaint.userId.email, subject, text, html);
    console.log("✅ Email sent successfully");

    res.json({ message: "Admin comment updated and email sent", complaint });
  } catch (err) {
    next(err);
  }
};
