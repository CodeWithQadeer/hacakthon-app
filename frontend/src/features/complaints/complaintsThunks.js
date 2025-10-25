// src/features/complaints/complaintsThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/api";

// ✅ Create complaint (requires user token)
export const createComplaint = createAsyncThunk(
  "complaints/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { token, ...data } = payload;
      const res = await API.post("/complaints", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.complaint;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ✅ Fetch all public complaints
export const fetchAllComplaints = createAsyncThunk(
  "complaints/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/complaints");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ✅ Fetch logged-in user's complaints
export const fetchMyComplaints = createAsyncThunk(
  "complaints/fetchMy",
  async (token, { rejectWithValue }) => {
    try {
      const res = await API.get("/complaints/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ✅ Get complaint by ID
export const fetchComplaintById = createAsyncThunk(
  "complaints/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/complaints/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// ✅ Admin: Update complaint (status or comment)
export const adminUpdateComplaint = createAsyncThunk(
  "complaints/adminUpdateComplaint",
  async ({ id, data, token }, { rejectWithValue }) => {
    try {
      // 🧠 Automatically choose endpoint based on what is being updated
      const endpoint = data.status
        ? `/admin/complaints/status/${id}`
        : `/admin/complaints/comment/${id}`;

      const res = await API.patch(endpoint, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.complaint;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);
