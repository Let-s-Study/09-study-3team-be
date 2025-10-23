import express from 'express';
import {
  createStudy,
  getAllStudies,
  deleteStudy,
  addStudyPoints,
  verifyPw,
} from '../controllers/studyController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', createStudy);
router.get('/', getAllStudies);
router.delete('/:id', authMiddleware, deleteStudy);
router.patch('/:id/points', authMiddleware, addStudyPoints);
router.post('/:studyId/verify', verifyPw);
export default router;
