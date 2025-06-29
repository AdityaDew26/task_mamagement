import React, { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Avatar, Menu, MenuItem, CssBaseline, Grid, Card, CardContent,
  Paper, LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  Assignment as TaskIcon,
  Mail as MailIcon,
  AccountCircle as ProfileIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Groups as TeamsIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getProfile } from '../../api/authApi';
import { getTasks } from '../../api/taskApi';
import './admin.css'

const drawerWidth = 240;
const COLORS = ['#42a5f5', '#ffb300', '#66bb6a'];

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState({ name: '', email: '' });
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
    fetchTasks();
  }, []);

  const total = tasks.length;
  const upcoming = tasks.filter(t => t.status === 'Upcoming').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  const getPercentage = (count) => (total ? Math.round((count / total) * 100) : 0);

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
        console.error('Error fetching user profile:', err);
        handleLogout();
      }
    };
    fetchUser();
  }, []);

  const pieData = [
    { name: 'Upcoming', value: upcoming },
    { name: 'In Progress', value: inProgress },
    { name: 'Completed', value: completed },
  ];

  const lineData = [
    { name: 'Mon', tasks: 20 },
    { name: 'Tue', tasks: 30 },
    { name: 'Wed', tasks: 43 },
    { name: 'Thu', tasks: 25 },
    { name: 'Fri', tasks: 32 },
    { name: 'Sat', tasks: 28 },
    { name: 'Sun', tasks: 15 },
  ];

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <List>
        {[
          { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
          { text: 'Teams', icon: <TeamsIcon />, path: '/teams' },
          { text: 'Tasks', icon: <TaskIcon />, path: '/tasks' },
          { text: 'Messages', icon: <MailIcon />, path: '/message' },
          { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
        ].map((item) => (
          <ListItemButton key={item.text} onClick={() => (window.location.href = item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
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
            Admin Dashboard
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
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} className='main-content'>
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          Welcome, {user.name}
        </Typography>

        {/* Progress Cards */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 2 }} className='task-card'>
              <Typography variant="h6"  gutterBottom className="section-title">Upcoming Tasks</Typography>
              <Typography>{upcoming} / {total}</Typography>
              <LinearProgress variant="determinate" value={getPercentage(upcoming)} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">In Progress</Typography>
              <Typography>{inProgress} / {total}</Typography>
              <LinearProgress color="info" variant="determinate" value={getPercentage(inProgress)} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">Completed</Typography>
              <Typography>{completed} / {total}</Typography>
              <LinearProgress color="success" variant="determinate" value={getPercentage(completed)} />
            </Paper>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Task Summary</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={70} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Task Activity</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tasks" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Calendar and Schedule */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Calendar</Typography>
                <Calendar onChange={setDate} value={date} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Schedule</Typography>
                <ul className="schedule-list">
                  <li>📅 Team Meeting – 9:00 AM</li>
                  <li>📊 Product Demo – 11:00 AM</li>
                  <li>📝 Planning Review – 3:00 PM</li>
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
