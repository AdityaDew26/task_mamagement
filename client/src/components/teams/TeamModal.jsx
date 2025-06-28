import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, FormControl, InputLabel, Select,
  OutlinedInput, Box, Chip
} from '@mui/material';
import { getUsers } from '../../api/userApi'; // ✅ imported here

const TeamModal = ({ open, handleClose, handleSubmit, formData, handleChange, isEdit }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers(); // ✅ use getUsers
        const data = Array.isArray(res.data) ? res.data : res.data.users || [];
        setUsers(data);
      } catch (error) {
        console.error('❌ Failed to fetch users:', error);
        setUsers([]);
      }
    };

    if (open) fetchUsers(); // Fetch only when modal is open
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit Team' : 'Create Team'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Team Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="members-label">Select Members</InputLabel>
          <Select
            labelId="members-label"
            name="members"
            multiple
            value={formData.members || []}
            onChange={handleChange}
            input={<OutlinedInput label="Select Members" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((id) => {
                  const user = users.find((u) => u._id === id);
                  return <Chip key={id} label={user?.name || 'Unknown'} />;
                })}
              </Box>
            )}
          >
            {Array.isArray(users) &&
              users.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamModal;
