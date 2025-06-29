// src/components/editor/EditorTaskManager.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, IconButton
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import TaskModal from '../../../components/tasks/TaskModal';
import {
  getTasks,
  updateTask
} from '../../../api/taskApi';
import { getProfile } from '../../../api/authApi';

const EditorTaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [editorId, setEditorId] = useState('');
  const [open, setOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Upcoming',
    team: '',
  });

  useEffect(() => {
    const fetchEditorAndTasks = async () => {
      try {
        const profileRes = await getProfile();
        const id = profileRes.data._id;
        setEditorId(id);

        const taskRes = await getTasks();
        const filteredTasks = Array.isArray(taskRes.data)
          ? taskRes.data.filter(task => task?.assignedEditor?._id === id)
          : [];

        setTasks(filteredTasks);
      } catch (error) {
        console.error('Error fetching editor profile or tasks:', error);
        setTasks([]);
      }
    };

    fetchEditorAndTasks();
  }, []);

  const handleOpen = (task) => {
   setFormData({
  title: task.title || '',
  description: task.description || '',
  status: task.status || 'Upcoming',
  team: task.team?._id || '',
  teamName: task.team?.name || '',
});
    setEditTaskId(task._id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTaskId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        team: formData.team || null
      };
      await updateTask(editTaskId, payload);
      const refreshedTasks = await getTasks();
      const filtered = Array.isArray(refreshedTasks.data)
        ? refreshedTasks.data.filter(task => task?.assignedEditor?._id === editorId)
        : [];
      setTasks(filtered);
      handleClose();
    } catch (error) {
      console.error('Task update failed:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        My Assigned Tasks
      </Typography>

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
                  <Box sx={{ mt: 1 }}>
                    <IconButton onClick={() => handleOpen(task)}>
                      <Edit />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No tasks assigned to you.</Typography>
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
        teams={[]}
          disableTeam={true}
      />
    </Box>
  );
};

export default EditorTaskManager;
