import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Avatar, Menu, MenuItem, CssBaseline
} from '@mui/material';
import {
  Menu as MenuIcon,
  Visibility as VisibilityIcon,
  Info as InfoIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { getProfile } from '../../api/authApi'; // Adjust path based on your project

const drawerWidth = 240;

const ViewerDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({ name: '', email: '' });

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const avatarLetters = user.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        handleLogout(); // Logout if unauthorized
      }
    };
    fetchUser();
  }, []);

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <List>
        {[
          { text: 'View Content', icon: <VisibilityIcon /> },
          { text: 'About', icon: <InfoIcon /> }
        ].map((item) => (
          <ListItem button key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Top Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Viewer Dashboard
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: '#1976d2', color: '#fff' }}>{avatarLetters}</Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <MenuItem disabled>{user.name}</MenuItem>
            <MenuItem disabled>{user.email}</MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Welcome, {user.name}
        </Typography>
        <Typography variant="body1">
          As a viewer, you can browse content, access public information, and more.
        </Typography>
      </Box>
    </Box>
  );
};

export default ViewerDashboard;
