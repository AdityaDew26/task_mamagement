// src/api/teamApi.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getTeams = () => API.get('/teams');
export const createTeam = (data) => API.post('/teams', data);
export const deleteTeam = (id) => API.delete(`/teams/${id}`);
export const updateTeam = (id, teamData) => API.put(`/teams/${id}`, teamData);
