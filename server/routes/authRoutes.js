import express from 'express';
import { Login, Signup, getMe,getAllUsers } from '../controller/AuthController.js';
import authMiddleware,{authenticateToken}  from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.get('/me', authMiddleware, getMe);
router.get('/users', getAllUsers);

export default router;
