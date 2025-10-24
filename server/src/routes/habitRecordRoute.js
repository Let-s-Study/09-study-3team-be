import express from 'express';
import {
  createHabitRecord,
  getWeeklyRecords,
  deleteRecord,
} from '../controllers/habitRecordController.js';

const router = express.Router();

router.post('/', createHabitRecord);
router.get('/:habitId/week', getWeeklyRecords);
router.delete('/:id', deleteRecord);

export default router;
