// src/components/viewer/ViewerTaskList.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent
} from '@mui/material';
import { getTasks } from '../../../api/taskApi';

const ViewerTaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching tasks', err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        All Tasks (Viewer)
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
                  {Array.isArray(task.team?.members) && task.team.members.length > 0 && (
                    <Typography variant="caption" display="block">
                      <strong>Members:</strong> {task.team.members.map(m => m.name).join(', ')}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No tasks available.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ViewerTaskList;
