import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  updateAdminComment,
  updateComplaintStatus,
} from "../controllers/adminController.js";

const router = express.Router();

// ✅ Update complaint status (Pending → In Progress → Resolved)
router.patch(
  "/complaints/status/:id",
  protect,
  requireRole("admin"),
  updateComplaintStatus
);

// ✅ Update admin comment only
router.patch(
  "/complaints/comment/:id",
  protect,
  requireRole("admin"),
  updateAdminComment
);

// ✅ Export only after all routes are defined
export default router;
