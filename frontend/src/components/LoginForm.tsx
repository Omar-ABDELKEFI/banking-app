import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authService.login({ email, password });
      login(response.token);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email Address"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
    </Box>
  );
}
