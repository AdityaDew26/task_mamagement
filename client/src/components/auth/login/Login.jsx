import React, { useState } from 'react';
import {
  TextField, Button, Container, Typography, Box,
  InputAdornment, IconButton, Snackbar, Alert, 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { login } from '../../../api/authApi';
import { useNavigate,Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setSnackbar({ open: true, message: 'Please fill in all fields', severity: 'error' });
      return;
    }

    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      setSnackbar({ open: true, message: 'Login successful!', severity: 'success' });

      setTimeout(() => navigate(res.data.dashboardPath), 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Login failed',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" mb={2}>Login</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            onChange={handleChange}
          />

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            label="Password"
            name="password"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>Login</Button>

          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/" style={{color:'blue', textDecoration:'none'}}>Sign up</Link>
          </Typography>
        </form>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;
