import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import ManagerDashboard from './components/ManagerDashboard';
import ReviewDisplayPage from './components/ReviewDisplayPage';
import Navigation from './components/Navigation';
import LoginPage from './components/LoginPage';
import PublicPropertyPage from './components/PublicPropertyPage';

// Create a modern theme for Flex Living
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

function App() {
  const isLoggedIn = localStorage.getItem('MANAGER_LOGGED_IN') === 'true';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              {/* Default to Login */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected manager routes */}
              <Route
                path="/dashboard"
                element={isLoggedIn ? <ManagerDashboard /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/reviews/:listingId"
                element={isLoggedIn ? <ReviewDisplayPage /> : <Navigate to="/login" replace />}
              />

              {/* Public property page (no login) */}
              <Route path="/property/:listingId" element={<PublicPropertyPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;