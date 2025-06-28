import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/admin';

export const getUsers = () => axios.get(`${BASE_URL}/users`, {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const updateUser = (id, data) => axios.put(`${BASE_URL}/users/${id}`, data, {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const deleteUser = (id) => axios.delete(`${BASE_URL}/users/${id}`, {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const toggleUserStatus = (id) => axios.patch(`${BASE_URL}/users/${id}/toggle`, {}, {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});
