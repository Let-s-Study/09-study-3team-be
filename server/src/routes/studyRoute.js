import express from 'express';

import {
  createStudy,
  getAllStudies,
  deleteStudy,
  addStudyPoints,
  verifyPw,
} from '../controllers/studyController.js';

const router = express.Router();

router.post('/', createStudy);
router.get('/', getAllStudies);
router.delete('/:id', deleteStudy);
router.patch('/:id/points', addStudyPoints);
router.post('/:studyId/verify', verifyPw);
export default router;
