import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'admin' | 'professor' | 'student';
} | null;

type AuthState = {
  user: User;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
};

const initialState: AuthState = { user: null, status: 'idle' };

// Login thunk: accepts either userId or email
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: { userIdOrEmail: string; password: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', payload);
      return data.user as NonNullable<User>;
    } catch (err: any) {
      // Backend error message fallback
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Register thunk
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload: { name: string; email: string; password: string; role?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', payload);
      return data.message as string;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

// Get current user
export const meThunk = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me');
      return data.user as NonNullable<User>;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
    }
  }
);

// Logout
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      return true;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => { state.status = 'loading'; state.error = undefined; })
      .addCase(loginThunk.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; })
      .addCase(loginThunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string || action.error.message; })
      .addCase(meThunk.fulfilled, (state, action) => { state.user = action.payload; state.status = 'succeeded'; })
      .addCase(logoutThunk.fulfilled, (state) => { state.user = null; state.status = 'idle'; });
  },
});

export default authSlice.reducer;
