// src/components/teams/TeamManager.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Grid, Card, CardContent, IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { getTeams } from '../../api/teamApi';
import TeamModal from './TeamModal';

const TeamManager = () => {
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [editTeamId, setEditTeamId] = useState(null);
  const [formData, setFormData] = useState({ name: '', members: [] });

  const fetchTeams = async () => {
    try {
      const res = await getTeams(); // ✅ Use the imported function
      setTeams(res.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleOpen = (team = null) => {
    if (team) {
      setFormData({
        name: team.name,
        members: team.members?.map((m) => m._id) || [],
      });
      setEditTeamId(team._id);
    } else {
      setFormData({ name: '', members: [] });
      setEditTeamId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTeamId(null);
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
      if (editTeamId) {
        await updateTeam(editTeamId, formData);
      } else {
        await createTeam(formData);
      }
      fetchTeams();
      handleClose();
    } catch (error) {
      console.error('Error submitting team:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeam(id);
      fetchTeams();
    } catch (error) {
      console.error('Failed to delete team', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Team Management</Typography>
      <Button variant="contained" onClick={() => handleOpen()}>
        Create Team
      </Button>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {teams.map((team) => (
          <Grid item xs={12} md={6} key={team._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{team.name}</Typography>
                <Typography variant="body2">
                  Created by: {team.createdBy?.name || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  Members: {
                    team.members && team.members.length > 0
                      ? team.members.map((m) => m.name).join(', ')
                      : 'None'
                  }
                </Typography>
                <IconButton onClick={() => handleOpen(team)}><Edit /></IconButton>
                <IconButton onClick={() => handleDelete(team._id)}><Delete /></IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TeamModal
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        isEdit={!!editTeamId}
      />
    </Box>
  );
};

export default TeamManager;
