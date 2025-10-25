import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { sendEmail } from "./utils/sendEmail.js";

dotenv.config();
connectDB();

const app = express();

app.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "codewithqadeer@gmail.com", // change this to your email
      "Test Email from Improve My City",
      "If you see this, your email setup works!"
    );

    res.send("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Email test error:", err);
    res.status(500).send("❌ Failed to send email: " + err.message);
  }
});



app.use(cors({
  origin: "http://localhost:5173",  // ✅ Your frontend port
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // ✅ Include PATCH
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("🌆 Improve My City API Running"));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
