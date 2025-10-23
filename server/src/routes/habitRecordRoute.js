import express from 'express';
import {
  createHabitRecord,
  getWeeklyRecords,
  deleteRecord,
} from '../controllers/habitRecordController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createHabitRecord);
router.get('/:habitId/week', authMiddleware, getWeeklyRecords);
router.delete('/:id', authMiddleware, deleteRecord);

export default router;
