import express from 'express';

import {
  createStudy,
  getAllStudies,
  deleteStudy,
  addStudyPoints,
} from '../controllers/studyController.js';

const router = express.Router();

router.post('/', createStudy);
router.get('/', getAllStudies);
router.delete('/:id', deleteStudy);
router.patch('/:id/points', addStudyPoints);
export default router;
