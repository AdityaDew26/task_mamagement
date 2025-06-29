import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Avatar, Menu, MenuItem, CssBaseline, Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Visibility as VisibilityIcon,
  Info as InfoIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { getProfile } from '../../api/authApi';
import { getNotifications, markNotificationRead } from '../../api/notificationApi';
import TaskManager from './viewerTask/TaskManager';

const drawerWidth = 240;

const ViewerDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [user, setUser] = useState({ name: '', email: '' });
  const [notifications, setNotifications] = useState([]);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotifClose = () => setNotifAnchorEl(null);

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
        handleLogout();
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications('viewer');
        setNotifications(res.data || []);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
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

      {/* Top AppBar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Viewer Dashboard
          </Typography>

          {/* Notification Icon */}
          <IconButton color="inherit" onClick={handleNotifOpen}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Notification Dropdown */}
          <Menu
            anchorEl={notifAnchorEl}
            open={Boolean(notifAnchorEl)}
            onClose={handleNotifClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            {Array.isArray(notifications) && notifications.length > 0 ? (
  notifications.map((notif, index) => (
    <MenuItem
      key={notif._id || index}
      onClick={async () => {
        try {
          await markNotificationRead(notif._id);
          setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
        } catch (err) {
          console.error('Error marking notification as read:', err);
        } finally {
          handleNotifClose();
        }
      }}
    >
      {notif?.message || 'No message'}
    </MenuItem>
  ))
) : (
  <MenuItem disabled>No new notifications</MenuItem>
)}
          </Menu>

          {/* Avatar Menu */}
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

      {/* Sidebar Drawer */}
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
        <TaskManager />
      </Box>
    </Box>
  );
};

export default ViewerDashboard;
