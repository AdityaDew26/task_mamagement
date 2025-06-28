// routes/teamRoutes.js
import express from 'express';
import {
  createTeam,
  getAllTeams,
  getTeamById,
  addMemberToTeam,
  updateTeam,
  deleteTeam
} from '../controller/teamController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createTeam);
router.get('/', authenticateToken, getAllTeams);
router.get('/:id', authenticateToken, getTeamById);
router.put('/:id/add-member', authenticateToken, addMemberToTeam);
router.put('/:id', authenticateToken, updateTeam);
router.delete('/:id', authenticateToken, deleteTeam);

export default router;
