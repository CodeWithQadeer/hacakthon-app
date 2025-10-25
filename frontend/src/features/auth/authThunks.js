// src/features/auth/authThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

// ✅ Register User
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // 👇 include /api/ prefix to match backend
      const res = await API.post("/api/auth/register", userData);
      // backend returns { user, token }
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Registration failed" }
      );
    }
  }
);

// ✅ Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (creds, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/auth/login", creds);
      return res.data; // { user, token }
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Login failed" }
      );
    }
  }
);

// ✅ Load current user profile (if using token)
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (token, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || { message: err.message || "Failed to load user" }
      );
    }
  }
);
