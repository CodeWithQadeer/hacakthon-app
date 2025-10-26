import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// 🔑 Function to sign JWT token
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// 🟢 REGISTER USER
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, adminKey } = req.body;

    // ✅ Check if user already exists
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    // ✅ Determine user role
    let userRole = "citizen"; // default role

    if (role === "admin") {
      // Verify admin secret key
      if (adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ message: "Invalid admin key" });
      }
      userRole = "admin";
    }

    // ✅ Create user
    const user = await User.create({ name, email, password, role: userRole });
    const token = signToken(user);

    res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

// 🔵 LOGIN USER
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};
