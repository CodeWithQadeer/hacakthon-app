import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * 🟢 PROTECT Middleware
 * - Ensures the user is authenticated
 * - Extracts token from Authorization header (Bearer <token>)
 * - Attaches user info (without password) to req.user
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and starts with "Bearer"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user data and exclude password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user)
        return res.status(404).json({ message: "User not found" });

      next();
    } else {
      res.status(401).json({ message: "No token provided" });
    }
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * 🔴 ADMIN ONLY Middleware
 * - Allows access only if the logged-in user has admin privileges
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // ✅ Access granted
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};
