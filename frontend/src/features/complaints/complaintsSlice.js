// src/features/complaints/complaintsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createComplaint,
  fetchAllComplaints,
  fetchMyComplaints,
  fetchComplaintById,
  adminUpdateComplaint,
} from "./complaintsThunks";

const initialState = {
  list: [],
  myList: [],
  current: null,
  loading: false,
  error: null,
};

const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Create
      .addCase(createComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
        state.myList.unshift(action.payload);
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

      // ✅ Fetch All
      .addCase(fetchAllComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

      // ✅ Fetch My Complaints
      .addCase(fetchMyComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.myList = action.payload;
      })
      .addCase(fetchMyComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

      // ✅ Fetch Complaint by ID
      .addCase(fetchComplaintById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaintById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchComplaintById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

      // ✅ Admin Update
      .addCase(adminUpdateComplaint.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((c) => c._id === updated._id);
        if (idx >= 0) state.list[idx] = updated;
        const myIdx = state.myList.findIndex((c) => c._id === updated._id);
        if (myIdx >= 0) state.myList[myIdx] = updated;
        if (state.current && state.current._id === updated._id)
          state.current = updated;
      });
  },
});

export default complaintsSlice.reducer;
