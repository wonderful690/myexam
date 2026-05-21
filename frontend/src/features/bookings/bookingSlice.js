import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/bookings';

export const fetchRooms = createAsyncThunk('bookings/fetchRooms', async () => {
  const { data } = await axios.get(`${API_URL}/rooms`);
  return data;
});

export const createBooking = createAsyncThunk('bookings/create', async (bookingData, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(API_URL, bookingData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Ошибка создания заявки');
  }
});

export const fetchMyBookings = createAsyncThunk('bookings/fetchMy', async () => {
  const { data } = await axios.get(`${API_URL}/my`);
  return data;
});

export const addReview = createAsyncThunk('bookings/addReview', async ({ bookingId, review }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/${bookingId}/review`, review);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Ошибка добавления отзыва');
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    rooms: [],
    myBookings: [],
    loading: false,
    error: null,
    success: null
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.rooms = action.payload;
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createBooking.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Заявка успешно создана!';
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.myBookings = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        const index = state.myBookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) state.myBookings[index] = action.payload;
        state.success = 'Отзыв успешно добавлен!';
      })
      .addCase(addReview.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearMessages } = bookingSlice.actions;
export default bookingSlice.reducer;