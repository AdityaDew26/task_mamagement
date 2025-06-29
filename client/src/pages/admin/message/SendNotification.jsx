// src/components/admin/SendNotificationForm.jsx
import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { sendNotification } from '../../../redux/Notifications/notification';

const SendNotificationForm = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('viewer');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    dispatch(sendNotification({ message, role }));
    setMessage('');
  };

  return (
    <Box sx={{ mt: 4, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>Send Notification</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          select
          label="Select Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          <MenuItem value="viewer">Viewer</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
        </TextField>
        <Button type="submit" variant="contained">Send</Button>
      </form>
    </Box>
  );
};

export default SendNotificationForm;
