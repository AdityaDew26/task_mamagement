// src/api/notificationApi.js
import axios from 'axios';

export const getNotifications = (role = 'admin') =>
  axios.get(`/notifications?role=${role}`);

export const markNotificationRead = (id) =>
  axios.patch(`/notifications/${id}/read`);
