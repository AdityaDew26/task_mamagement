// src/components/tasks/TaskManager.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent,
  IconButton, Button
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import TaskModal from './TaskModal';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from '../../api/taskApi';
import { getTeams } from '../../api/teamApi';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Upcoming',
    team: '',
  });

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching tasks', err);
      setTasks([]);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await getTeams();
      setTeams(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching teams:', err);
      setTeams([]);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTeams();
  }, []);

  const handleOpen = (task = null) => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Upcoming',
        team: task.team?._id || '',
      });
      setEditTaskId(task._id);
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Upcoming',
        team: '',
      });
      setEditTaskId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTaskId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
  try {
    const payload = {
      ...formData,
      team: formData.team || null  // convert empty string to null if needed
    };
    if (editTaskId) {
      await updateTask(editTaskId, payload);
    } else {
      await createTask(payload);
    }
    fetchTasks();
    handleClose();
  } catch (error) {
    console.error('Task operation failed:', error);
  }
};

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Task Management</Typography>
      <Button variant="contained" onClick={() => handleOpen()}>
        Create Task
      </Button>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Grid item key={task._id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography variant="body2">{task.description}</Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Status: {task.status}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Team:</strong> {task.team?.name || 'No team assigned'}
                  </Typography>
                  {Array.isArray(task.team?.members) && task.team.members.length > 0 && (
                    <>
                      <Typography variant="caption" display="block">
                        <strong>Members:</strong> {task.team.members.map(m => m.name).join(', ')}
                      </Typography>
                     
                    </>
                  )}
                  <Box sx={{ mt: 1 }}>
                    <IconButton onClick={() => handleOpen(task)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(task._id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1">No tasks found.</Typography>
          </Grid>
        )}
      </Grid>

      <TaskModal
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        isEdit={!!editTaskId}
        teams={teams}
      />
    </Box>
  );
};

export default TaskManager;
