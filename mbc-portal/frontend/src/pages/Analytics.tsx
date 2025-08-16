import { useEffect, useState } from 'react';
import { Container, Paper, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import api from '../lib/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

export default function Analytics() {
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		api.get('/analytics/overview').then((res) => setData(res.data)).catch(() => setData(null));
	}, []);

	if (!data) return (
		<Container sx={{ py: 6 }}><Typography>Loading analytics…</Typography></Container>
	);

	return (
		<Container sx={{ py: 6 }}>
			<Stack spacing={3}>
				<Typography variant="h5" fontWeight={700}>Department Analytics</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 2, height: 360 }}>
							<Typography variant="subtitle1" gutterBottom>Program Distribution</Typography>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie dataKey="count" nameKey="program" data={data.distributions.programDistribution} outerRadius={120}>
										{data.distributions.programDistribution.map((_: any, idx: number) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</Paper>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 2, height: 360 }}>
							<Typography variant="subtitle1" gutterBottom>Students per Branch</Typography>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={data.distributions.branchDistribution}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="branch" hide={false} />
									<YAxis />
									<Tooltip />
									<Bar dataKey="count" fill="#8884d8" />
								</BarChart>
							</ResponsiveContainer>
						</Paper>
					</Grid>
				</Grid>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 2, height: 360 }}>
							<Typography variant="subtitle1" gutterBottom>Fee Status</Typography>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={data.distributions.feeStatus}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="status" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="count" fill="#82ca9d" />
								</BarChart>
							</ResponsiveContainer>
						</Paper>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 2, height: 360 }}>
							<Typography variant="subtitle1" gutterBottom>Grades Distribution</Typography>
							<ResponsiveContainer width="100%" height={300}>
								<BarChart data={data.distributions.gradeDistribution}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="grade" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="count" fill="#ffc658" />
								</BarChart>
							</ResponsiveContainer>
						</Paper>
					</Grid>
				</Grid>
			</Stack>
		</Container>
	);
}