import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Alert, Box } from '@mui/material';
import { Lock, Person } from '@mui/icons-material';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      // Simple hardcoded credentials for demo
      if (username === 'manager' && password === 'flexliving2024') {
        // Store login state
        localStorage.setItem('MANAGER_LOGGED_IN', 'true');
        localStorage.setItem('MANAGER_USERNAME', username);
        window.location.href = '/dashboard';
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (e: any) {
      setError('Invalid username or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!submitting) handleSubmit();
    }
  };

  const handleClear = () => {
    setUsername('');
    setPassword('');
    setError(null);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            Flex Living
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
            Manager Portal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to access the reviews dashboard
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={submitting}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />
            }}
          />

          <TextField
            label="Password"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={submitting}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />
            }}
          />
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            fullWidth
            onClick={handleSubmit} 
            disabled={submitting}
            size="large"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button variant="text" onClick={handleClear} disabled={submitting}>
            Clear
          </Button>
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            Demo Credentials:
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" textAlign="center">
            Username: manager | Password: flexliving2024
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;