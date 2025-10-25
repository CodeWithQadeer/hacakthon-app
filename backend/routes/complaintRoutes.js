// routes/complaintRoutes.js

import express from "express";
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  getComplaintStatus,
  updateComplaint, // ✅ Admin can update
} from "../controllers/complaintController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🟢 USER: Create a new complaint
 * - Only logged-in users can create
 */
router.post("/", protect, createComplaint);

/**
 * 🟡 USER: Get all their own complaints
 */
router.get("/my", protect, getMyComplaints);

/**
 * 🔵 ALL USERS: Get all complaints (everyone can see)
 * - Removed adminOnly middleware so all logged-in users can view
 * - You can remove `protect` if you want even public (non-logged-in) users to see
 */
router.get("/", protect, getAllComplaints);

/**
 * 🟣 Get single complaint by ID
 */
router.get("/:id", protect, getComplaintById);

/**
 * 🟠 Get complaint status (for chatbot or user status checking)
 */
router.get("/chatbot/status/:id", protect, getComplaintStatus);

/**
 * 🔴 ADMIN: Update complaint (status/message)
 * - Also triggers Gmail notification to the complaint owner
 */
router.put("/:id", protect, adminOnly, updateComplaint);

export default router;
