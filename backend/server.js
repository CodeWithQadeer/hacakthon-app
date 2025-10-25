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

// ✅ CORS configuration for both local and deployed frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",                 // Local frontend
      "https://improve-my-city.vercel.app",    // Deployed frontend on Vercel
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Test route for email verification
app.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "codewithqadeer@gmail.com", // your email here
      "Test Email from Improve My City",
      "✅ If you received this email, Brevo or Nodemailer setup works fine!"
    );

    res.send("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Email test error:", err);
    res.status(500).send("❌ Failed to send email: " + err.message);
  }
});

// ✅ Root route
app.get("/", (req, res) => res.send("🌆 Improve My City API Running"));

// ✅ Error middleware
app.use(errorHandler);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
