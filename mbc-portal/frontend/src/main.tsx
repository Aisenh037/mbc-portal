import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './pages/App'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'

const router = createBrowserRouter([
	{ path: '/', element: <App /> },
	{ path: '/login', element: <Login /> },
	{ path: '/dashboard', element: <Dashboard /> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<RouterProvider router={router} />
			</ThemeProvider>
		</Provider>
	</React.StrictMode>,
)
