import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dashboard, Reviews, Logout } from '@mui/icons-material';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isPublicPage = location.pathname.startsWith('/property/');
  const isLoginPage = location.pathname === '/' || location.pathname.startsWith('/login');
  const isLoggedIn = localStorage.getItem('MANAGER_LOGGED_IN') === 'true';
  const username = localStorage.getItem('MANAGER_USERNAME');

  const handleLogout = () => {
    localStorage.removeItem('MANAGER_LOGGED_IN');
    localStorage.removeItem('MANAGER_USERNAME');
    window.location.href = '/login';
  };

  if (isLoginPage) {
    return null;
  }

  return (
    <AppBar position="static" elevation={0} sx={{ backgroundColor: 'primary.main' }}>
      <Container maxWidth="xl">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              fontSize: '1.5rem',
            }}
          >
            Flex Living Reviews
          </Typography>
          
          {!isPublicPage && isLoggedIn && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Welcome, {username}
              </Typography>
              
              <Button
                color="inherit"
                startIcon={<Dashboard />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Manager Dashboard
              </Button>
              
              <Button
                color="inherit"
                startIcon={<Reviews />}
                onClick={() => navigate('/dashboard')}
                sx={{
                  backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                View Reviews
              </Button>

              <Button
                color="inherit"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          )}

          {isPublicPage && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Manager Login
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;