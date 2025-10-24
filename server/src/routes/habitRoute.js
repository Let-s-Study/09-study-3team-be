import express from 'express';

import {
  createHabit,
  getHabitsByStudyId,
  updateHabit,
  deleteHabit,
} from '../controllers/habitController.js';

const router = express.Router();

router.post('/', createHabit);
router.get('/:studyId', getHabitsByStudyId);
router.patch('/:id', updateHabit);
router.delete('/:id', deleteHabit);

export default router;
