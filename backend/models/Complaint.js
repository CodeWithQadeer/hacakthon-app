import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: 3,
      maxlength: 150
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: 5
    },
    category: {
      type: String,
      enum: ["Road", "Garbage", "Electricity", "Water", "Other"],
      default: "Other"
    },
    imageUrl: {
      type: String
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String }
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    },
    adminComment: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);
