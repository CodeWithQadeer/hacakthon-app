import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
} from "../controllers/complaintController.js";

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/", getAllComplaints);
router.get("/:id", getComplaintById);

export default router;
