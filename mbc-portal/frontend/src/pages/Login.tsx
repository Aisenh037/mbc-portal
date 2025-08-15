import { useState } from 'react';
import { Button, Container, Stack, TextField, Typography, Alert } from '@mui/material';
import { useAppDispatch } from '../utils/hooks';
import { loginThunk, meThunk } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			await dispatch(loginThunk({ email, password })).unwrap();
			await dispatch(meThunk()).unwrap();
			navigate('/dashboard');
		} catch (err: any) {
			setError(err?.message || 'Login failed');
		}
	};

	return (
		<Container maxWidth="xs" sx={{ py: 8 }}>
			<Stack spacing={2} component="form" onSubmit={onSubmit}>
				<Typography variant="h5" fontWeight={700}>Login</Typography>
				{error && <Alert severity="error">{error}</Alert>}
				<TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				<Button type="submit" variant="contained">Sign in</Button>
			</Stack>
		</Container>
	);
}