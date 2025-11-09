import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

// Defines the TypeScript type for the User object. Can be null if not logged in.
type User = {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'admin' | 'professor' | 'student';
} | null;

// Defines the shape of the authentication state managed by Redux.
type AuthState = {
  user: User;
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Tracks API request status.
  error?: string; // Stores error messages if an API call fails.
};

// The initial state for the authentication slice.
const initialState: AuthState = { user: null, status: 'idle' };

// Async thunk for handling user login. It accepts either a userId or an email.
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: { userIdOrEmail: string; password: string }, { rejectWithValue }) => {
    try {
      // Makes a POST request to the backend's login endpoint.
      const { data } = await api.post('/auth/login', payload);
      // On success, returns the user data from the response.
      return data.user as NonNullable<User>;
    } catch (err: any) {
      // If the request fails, it rejects with the error message from the backend.
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for handling user registration.
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

// Async thunk for fetching the current user's data (e.g., after a page refresh).
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

// Async thunk for logging the user out.
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

// Creates the Redux slice for authentication.
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  // Manages state changes based on the lifecycle of the async thunks.
  extraReducers: (builder) => {
    builder
      // When login starts, set status to 'loading' and clear any previous errors.
      .addCase(loginThunk.pending, (state) => { state.status = 'loading'; state.error = undefined; })
      // When login succeeds, update the user data and set status to 'succeeded'.
      .addCase(loginThunk.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; })
      // When login fails, set status to 'failed' and store the error message.
      .addCase(loginThunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload as string || action.error.message; })
      // When fetching user data succeeds, update the user in the state.
      .addCase(meThunk.fulfilled, (state, action) => { state.user = action.payload; state.status = 'succeeded'; })
      // When logout succeeds, reset the user state to its initial values.
      .addCase(logoutThunk.fulfilled, (state) => { state.user = null; state.status = 'idle'; });
  },
});

export default authSlice.reducer;