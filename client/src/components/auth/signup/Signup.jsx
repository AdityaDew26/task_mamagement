import React, { useState } from 'react';
import {
  TextField, Button, Container, Typography, Box, MenuItem,
  InputAdornment, IconButton, Snackbar, Alert
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signup } from '../../../api/authApi';
import { useNavigate,Link } from 'react-router-dom';

const roles = ['admin', 'manager', 'editor', 'viewer'];

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = formData;

    if (!name || !email || !password || !confirmPassword || !role) {
      setSnackbar({ open: true, message: 'Please fill in all fields', severity: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }

    try {
      const res = await signup({ name, email, password, role });
      localStorage.setItem('token', res.data.token);
      setSnackbar({ open: true, message: 'Signup successful!', severity: 'success' });

      setTimeout(() => navigate(res.data.dashboardPath), 1500);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Signup failed',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" mb={2}>Signup</Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Name" name="name" onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Email" name="email" onChange={handleChange} />

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

          <TextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            margin="normal"
            label="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <TextField
            select fullWidth margin="normal" label="Role" name="role"
            value={formData.role} onChange={handleChange}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </TextField>

          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>Sign Up</Button>
              <p style={{marginTop:'10px', textAlign:'center'}}>Already a user? <Link to='/login' style={{color:'blue', textDecoration:'none'}}>SignIn</Link></p>
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

export default Signup;
