import express from 'express';
import { getAllUsers, updateUser, deleteUser, toggleUserStatus } from '../controller/adminController.js';
import authMiddleware  from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', authMiddleware, getAllUsers);
router.put('/users/:id', authMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, deleteUser);
router.patch('/users/:id/toggle', authMiddleware, toggleUserStatus);

export default router;
