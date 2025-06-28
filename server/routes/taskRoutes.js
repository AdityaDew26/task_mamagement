// routes/taskRoutes.js
import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskStats,
  updateTask,
  deleteTask,
} from '../controller/taskController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authenticateToken, createTask);
router.get('/', authenticateToken, getAllTasks);
router.get('/stats', authenticateToken, getTaskStats);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
