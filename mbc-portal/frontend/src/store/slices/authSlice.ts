import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

type User = { id: string; name: string; email: string; role: 'developer' | 'admin' | 'professor' | 'student' } | null;

type AuthState = {
	user: User;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error?: string;
}

const initialState: AuthState = { user: null, status: 'idle' };

export const loginThunk = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
	const { data } = await api.post('/auth/login', payload);
	return data.user as NonNullable<User>;
});

export const registerThunk = createAsyncThunk('auth/register', async (payload: { name: string; email: string; password: string; role?: string }) => {
	const { data } = await api.post('/auth/register', payload);
	return data.message as string;
});

export const meThunk = createAsyncThunk('auth/me', async () => {
	const { data } = await api.get('/auth/me');
	return data.user as NonNullable<User>;
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
	await api.post('/auth/logout');
	return true;
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(loginThunk.pending, (state) => { state.status = 'loading'; })
			.addCase(loginThunk.fulfilled, (state, action) => { state.status = 'succeeded'; state.user = action.payload; })
			.addCase(loginThunk.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
			.addCase(meThunk.fulfilled, (state, action) => { state.user = action.payload; state.status = 'succeeded'; })
			.addCase(logoutThunk.fulfilled, (state) => { state.user = null; state.status = 'idle'; });
	}
});

export default authSlice.reducer;