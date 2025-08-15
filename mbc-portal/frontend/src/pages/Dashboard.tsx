import { useEffect } from 'react';
import { Container, Stack, Typography, Chip, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { logoutThunk, meThunk } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useAppSelector((s) => s.auth.user);

	useEffect(() => {
		if (!user) dispatch(meThunk());
	}, [user, dispatch]);

	useEffect(() => {
		if (user === null) navigate('/login');
	}, [user, navigate]);

	return (
		<Container sx={{ py: 6 }}>
			<Stack spacing={2}>
				<Typography variant="h5" fontWeight={700}>Dashboard</Typography>
				{user && <Stack direction="row" spacing={2} alignItems="center">
					<Typography>Hello, {user.name}</Typography>
					<Chip label={user.role.toUpperCase()} color="primary" />
					<Button onClick={() => dispatch(logoutThunk()).then(() => navigate('/'))} variant="outlined">Logout</Button>
				</Stack>}
				<Typography color="text.secondary">Role-based widgets and navigation would render here.</Typography>
			</Stack>
		</Container>
	);
}