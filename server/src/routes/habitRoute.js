import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createHabit,
  getHabitsByStudyId,
  updateHabit,
  deleteHabit,
} from '../controllers/habitController.js';
const router = express.Router();

router.post('/', authMiddleware, createHabit);
router.get('/:studyId', authMiddleware, getHabitsByStudyId);
router.patch('/:id', authMiddleware, updateHabit);
router.delete('/:id', authMiddleware, deleteHabit);

export default router;
