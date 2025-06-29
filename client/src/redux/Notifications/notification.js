import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const sendNotification = createAsyncThunk(
  'notification/sendNotification',
  async ({ message, role }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/api/notifications', { message, role }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error sending notification');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    status: 'idle',
    error: null,
    successMessage: null
  },
  reducers: {
    clearStatus: (state) => {
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendNotification.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.successMessage = 'Notification sent successfully';
      })
      .addCase(sendNotification.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearStatus } = notificationSlice.actions;

export default notificationSlice.reducer;
