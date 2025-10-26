import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🟢 Verify that the user is logged in
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🔴 Allow only admin users to access certain routes
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // ✅ user is admin
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};
