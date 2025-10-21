import express from 'express';
import {
  createStudy,
  getAllStudies,
  deleteStudy,
} from '../controllers/studyController.js';

const router = express.Router();

router.post('/', createStudy);
router.get('/', getAllStudies);
router.delete('/:id', deleteStudy);

export default router;
