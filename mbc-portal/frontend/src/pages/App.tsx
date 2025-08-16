import { Button, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function App() {
	return (
		<Container maxWidth="sm" sx={{ py: 8 }}>
			<Stack spacing={3} alignItems="center">
				<Typography variant="h4" fontWeight={700}>MBC Department Portal</Typography>
				<Typography color="text.secondary" align="center">MBC Portal</Typography>
				<Stack direction="row" spacing={2}>
					<Button component={RouterLink} to="/login" variant="contained">Login</Button>
					<Button component={RouterLink} to="/dashboard" variant="outlined">Dashboard</Button>
				</Stack>
			</Stack>
		</Container>
	);
}