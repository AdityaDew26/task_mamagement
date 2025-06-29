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
  teams = [],
  disableTeam = false
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
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
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
          {disableTeam ? (
            <TextField
              label="Team"
              value={formData.teamName || 'No team'}
              fullWidth
              disabled
            />
          ) : (
            <>
              <InputLabel id="team-label">Team</InputLabel>
              <Select
                labelId="team-label"
                name="team"
                value={formData.team}
                onChange={handleChange}
                label="Team"
              >
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <MenuItem key={team._id} value={team._id}>
                      {team.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No teams available</MenuItem>
                )}
              </Select>
            </>
          )}
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
