import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
	palette: {
		primary: { main: '#0052cc' },
		secondary: { main: '#00b8d9' }
	},
	typography: {
		fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
	}
});

export default theme;