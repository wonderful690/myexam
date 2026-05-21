import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/admin';

export const fetchAllBookings = createAsyncThunk('admin/fetchBookings', async (params = {}) => {
  const { data } = await axios.get(`${API_URL}/bookings`, { params });
  return data;
});

export const updateBookingStatus = createAsyncThunk('admin/updateStatus', async ({ id, status }) => {
  const { data } = await axios.patch(`${API_URL}/bookings/${id}`, { status });
  return data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    bookings: [],
    pagination: {},
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.bookings = action.payload.bookings;
        state.pagination = action.payload.pagination;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) state.bookings[index] = action.payload;
      });
  }
});

export default adminSlice.reducer;