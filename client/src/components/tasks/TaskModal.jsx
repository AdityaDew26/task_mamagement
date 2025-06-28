// src/components/tasks/TaskModal.jsx
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const TaskModal = ({
  open,
  handleClose,
  handleSubmit,
  formData,
  handleChange,
  isEdit,
  teams = [] // ✅ Accept teams as a prop
}) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="title"
          label="Title"
          fullWidth
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="description"
          label="Description"
          fullWidth
          value={formData.description}
          onChange={handleChange}
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="Upcoming">Upcoming</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>

      <FormControl fullWidth sx={{ mt: 2 }}>
  <InputLabel>Team</InputLabel>
  <Select
    name="team"
    value={formData.team}
    onChange={handleChange}
    label="Team"
  >
    {teams.map((team) => (
      <MenuItem key={team._id} value={team._id}>
        {team.name}
      </MenuItem>
    ))}
  </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
