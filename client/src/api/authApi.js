// src/api/authApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth'; // ✅ Corrected

export const signup = (data) => axios.post(`${BASE_URL}/signup`, data);
export const login = (data) => axios.post(`${BASE_URL}/login`, data);
export const getProfile = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

